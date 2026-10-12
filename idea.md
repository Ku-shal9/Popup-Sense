
# PopupSense

**An AI-powered, context-aware popup and overlay blocker.**

## Problem

It is frustrating when a website throws a popup or some kind of on-screen overlay at you, especially when you already have a strict popup blocker installed and it still manages to get through. Most blockers rely heavily on predefined rules and patterns, so they can be effective at blocking obvious unwanted pop-ups but can also be rigid. Sometimes a popup is necessary, such as a login window, payment flow, verification step, or notification. Blocking everything aggressively can break a website, while being too relaxed leaves room for intrusive ads, deceptive overlays, and potentially suspicious behavior to slip through.

This affects everyday users who want a cleaner and safer browsing experience. They are stuck with a tradeoff between blocking too much and blocking too little. If the problem remains unsolved, users may have to deal with annoying pop-ups, repeatedly allow legitimate ones, or tolerate intrusive content. The bigger issue is that a blocker may detect what appeared without understanding why it appeared or whether the user actually needs it.

## Idea

PopupSense aims to add an AI-powered decision layer that evaluates a popup or on-screen overlay before deciding what should happen to it. Rather than simply adding another strict set of blocking rules, it will use an open-weight AI model to assess context such as page content, DOM structure, URL, popup characteristics, and how the popup was triggered.

Based on that assessment, the system can allow the popup, block it, or ask the user when the situation is uncertain. This could help distinguish legitimate interactions, such as authentication or payment windows, from intrusive advertisements, deceptive overlays, and suspicious behavior.

The goal is to move from:

**"Popup detected → block it"**

to:

**"Popup detected → understand it → decide what to do."**

Over time, PopupSense could also use user overrides and previous decisions as context, making its decisions more personalized instead of relying entirely on rigid predefined rules.

## How AI Powers It

The AI acts as the decision-making layer between the browser and the popup. When a popup or overlay is detected, the system collects relevant context, such as page content, DOM structure, URL, popup behavior, and how it was triggered. The open-weight AI model analyzes that information and classifies the popup's likely purpose or risk, such as a legitimate interaction, advertisement, intrusive content, or suspicious behavior.

Based on its assessment, the model produces a structured decision that the extension can use to allow, block, or ask the user about the popup. Its output directly informs the browser's action rather than merely generating a text explanation. When confidence is low, the system should favor asking the user or applying a conservative fallback instead of automatically blocking something important.

In a later version, user overrides and previous decisions could provide additional context for future assessments.

## High-Level Workflow

1. Detect a popup, overlay, or relevant browser event.
2. Collect useful context about the page and the popup.
3. Use an open-weight AI model to assess intent and risk.
4. Choose an action: allow, block, or ask the user.
5. Apply the action through the browser extension.
6. Optionally record user feedback and past decisions to inform future assessments.

## Intended AI Behavior

The AI should do more than label something as an advertisement. It should assess context and produce a structured decision that is consumed by the extension's logic. The project will document the exact model used and the code location where its output affects the product's behavior.

## Scope and Safety

PopupSense is intended to help manage intrusive or suspicious pop-ups and on-page overlays, not to guarantee that every advertisement or piece of adware will be detected. A practical first version can focus on a limited set of popup types and websites, with clear user overrides and conservative handling of uncertain cases.

Existing deterministic rules can handle obvious cases, while AI is reserved for cases where contextual judgment is useful. The extension should avoid automatically blocking critical interactions when its assessment is uncertain.

## Potential Future Improvements

- Add a preference or memory layer for user overrides.
- Evaluate decisions against a labeled set of legitimate and intrusive pop-ups.
- Improve detection of overlays that appear within the current page rather than opening a new tab or window.
- Add a transparent explanation of the evidence behind each decision.
- Expand testing across different websites, popup types, and browser environments.
- Optimize model inference to reduce latency and unnecessary resource usage.
