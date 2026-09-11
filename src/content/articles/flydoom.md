---
title: "a fruit fly brain played doom. then the internet found it."
description: "how a connectome experiment resurfaced, acquired its own funding vehicle, and gave me a reason to finish the research properly."
published: 2026-09-11
readingTime: "4 min read"
tags:
  - connectomics
  - neuromorphic computing
  - doom
---

I opened X yesterday for the first time in weeks and found out that strangers had built a funding vehicle around one of my side projects. They were holding the proceeds for me in escrow.

The project is [FlyDOOM](https://github.com/mutkuoz/flydoom). On 20 August, I took the FAFB fruit fly connectome—139,255 reconstructed neurons and roughly 2.7 million synapses—and fed *DOOM* into it through the fly's visual pathway. I read the motor output back out as control signals.

A real biological wiring diagram was playing a 1993 shooter.

Nothing was trained. There was no reward function and no learning. The connections belonged to the fly, exactly as they had been measured, and they did not change. The interesting question was never whether a frozen fly brain could finish a level. It was what a real nervous system would do when dropped somewhere it had never evolved to be.

I published the repository and moved on. Four people on GitHub saw it.

## being found

Then the connectome discussion took off online. A group I had never met went looking for prior work, found the repository, and decided the earlier version deserved credit. They built a funding mechanism around it and routed the proceeds to my GitHub account.

I only learned about it because I happened to check social media. I replied to posts, shared gameplay clips, and watched the displayed market cap of $FLYDOOM pass $65,000.

The money is not the interesting part. Recognition for a piece of research now travels through channels nobody designed for that purpose. It can cross research communities, open-source networks, social platforms, and on-chain markets, then reach you whether or not you were paying attention.

There is something strange and encouraging in that. Publishing unfinished work in public can create a trail. Sometimes that trail stays quiet. Sometimes strangers find it, preserve its provenance, and send a signal back.

## finishing the work

I am treating this as a reason to finish FlyDOOM properly. I am rerunning the methodology on the HHMI Janelia dataset and writing up the paper.

The repository now includes the simulator, experiment suite, results, technical notes, and gameplay recordings. The results are more useful than a clean success story: motion computation appears in the visual system, but the original motor readout does not receive enough of it; touch reaches the steering pathway without preserving left-right direction; smell is the sensory path that behaves as the wiring predicts. Those failures expose exactly what a connectome provides—and what it does not.

If you have arXiv endorsement rights for **cs.NE**, I am looking for an endorsement. If you work anywhere near connectomics or neuromorphic computing, I would welcome the conversation.

[explore the FlyDOOM repository](https://github.com/mutkuoz/flydoom) · [see the LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7504250062349443075/) · [follow updates on X](https://x.com/mutkuoz)
