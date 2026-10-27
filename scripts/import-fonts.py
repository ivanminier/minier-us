"""Refresh the portfolio's Latin WOFF2 subsets and retain their upstream OFLs."""
import pathlib
import re
import tempfile
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'fonts'
FAMILIES = [
    'Fraunces', 'Manrope', 'Space Grotesk', 'Outfit', 'Inter', 'IBM Plex Sans',
    'IBM Plex Mono', 'Source Serif 4', 'Source Sans 3', 'Literata', 'DM Sans',
]
USER_AGENT = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
)


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    return urllib.request.urlopen(request, timeout=30).read()


# Complete every download before changing the current font assets.
with tempfile.TemporaryDirectory(prefix='minier-fonts-') as directory:
    staged = pathlib.Path(directory)
    for family in FAMILIES:
        slug = family.lower().replace(' ', '-')
        url = (
            'https://fonts.googleapis.com/css2?family='
            + family.replace(' ', '+') + ':wght@400;500;600;700&display=swap'
        )
        css = fetch(url).decode()
        blocks = re.findall(r'/\* latin \*/\s*(@font-face\s*\{[^}]+\})', css)
        if not blocks:
            raise ValueError('No Latin subset returned for ' + family)
        output, seen = [], {}
        for block in blocks:
            remote = re.search(r'url\(([^)]+)\)', block)[1]
            if not remote.endswith('.woff2'):
                raise ValueError('Expected WOFF2 for ' + family)
            if remote not in seen:
                filename = slug + '-' + str(len(seen)) + '.woff2'
                seen[remote] = filename
                (staged / filename).write_bytes(fetch(remote))
            output.append(block.replace(remote, '/fonts/' + seen[remote]))
        (staged / (slug + '.css')).write_text('\n'.join(output) + '\n')
        license_url = (
            'https://raw.githubusercontent.com/google/fonts/main/ofl/'
            + family.lower().replace(' ', '') + '/OFL.txt'
        )
        license_text = fetch(license_url).decode()
        (staged / (slug + '-OFL.txt')).write_text(
            '\n'.join(line.rstrip() for line in license_text.splitlines()) + '\n'
        )
    ROOT.mkdir(exist_ok=True)
    for file in staged.iterdir():
        (ROOT / file.name).write_bytes(file.read_bytes())
