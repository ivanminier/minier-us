# Media credits — revision 2

All catalog identities, channel names, films, series, episode titles and synopsis
text in this capture batch are fictional. Lineup includes no TV service or media
subscription. Users bring their own authorized sources. No commercial poster,
broadcaster logo, scraped metadata, paid service, trial, or provider credential
was used. The ordinary public demo was preserved.

## Original photography-style art

Nineteen original photorealistic fictional scene images were created on
2026-10-26 using the built-in OpenAI `image_gen` tool. They are AI-generated
images, not photographs of actual productions, performers or broadcasts.
`media/originals/` preserves the generated PNGs. `media/image-generation.json`
and `media/extra-image-generation.json` retain the prompts, shared instructions
and original tool output paths. The copies here make the package portable.
`media/all-original-art-review.jpg` gives a labeled overview.

Subjects: rain-soaked railway, forest fox, handmade pasta, football stadium,
coastal rescue crew, astronaut habitat, children in an orchard, glasshouse
mystery, lighthouse keeper's daughter, orchard grower, television static,
northern voyage, painter, canoe journey, period keepsake, cartographer,
railway dispatcher, harbor crew comedy and archive mystery.

`Scripts/generate_marketing_media.swift` composes original poster typography,
clean title-free backdrops and compact fictional channel monograms from these
originals using Apple frameworks and installed system fonts. Movie and series
posters use distinct scene assignments; clean backdrops are used in mosaics.
Three-item mosaics repeat an existing item in the fourth cell rather than
introducing a black quadrant or an extra catalog item.

## Video and audio

`media/coast-0.mp4` through `coast-7.mp4` are eight original 180-second H.264
960×540, 12 fps camera-motion studies of the first eight generated scenes.
They contain actual encoded pan/zoom motion, not filmed dramatic performances
or moving sports action. `coast` is a legacy fixture filename, not a claim
about the subject. A quiet original synthesized tone bed is encoded as AAC by
`Scripts/add_marketing_audio.swift`. No commercial music is present.

Marketing movie/episode durations are 180 seconds to match these assets.
Episodes explicitly describe three-minute original fictional scenes. Several
catalog items share a genre-appropriate video study; poster and video are not
a claim of a complete film/episode. The four multiview feeds use four distinct
files (stadium, railway, forest, kitchen), four real AVFoundation engines and
one unmuted engine. Playback state evidence accompanies the captures.

## Capture boundaries

Media is served only over the owned loopback fixture server at 127.0.0.1:18741.
Fixture activation requires a Debug simulator launch and explicit marketing
arguments. No original generated media is bundled into the shipping app.
The existing Lineup icon is reused from the project, whose icon generator
remains `Scripts/generate_icons.swift`. No new dependency was installed.

These are authentic simulator captures of shipped views using fictional data.
The separate captioned compositions uniformly scale the complete capture, with
headline and disclosure outside it. Raw PNGs are untouched. Native exports only
normalize encoded orientation and remove alpha; website derivatives resize to
fit without changing aspect ratio. No status icons, focus rings, controls or
video frames have been painted into any app capture.
