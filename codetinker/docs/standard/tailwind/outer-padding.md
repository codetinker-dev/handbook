---
id: tailwind-padding
title: Outer Padding
tags:
  - Code
  - Standard
  - tailwind
sidebar_position: 1
---


# Design concept
To make sure we can easily maintain responsiveness and padding, we have introduced these Tailwind design concepts.

## Padding Concept

### Problem
The design of our page mostly looks like this:
![alt text](../../../static/img/tailwind/padding-concept-01.png)

Problem is our upper side have padding it self

![alt text](../../../static/img/tailwind/padding-concept-02.png)

Then when  we do the bottom padding, we often do `pb-6 px-6`

![alt text](../../../static/img/tailwind/padding-concept-03.png)

therefore, its hard to update padding, if we want to update the gap between both section.

eg: i want padding between them bigger 

![alt text](../../../static/img/tailwind/padding-concept-04.png)

when i do `p-8`, i will headache

![alt text](../../../static/img/tailwind/padding-concept-05.png)

In the final solution and most easy and lazy way, i will do this `p-6 pb-8`
or `px-6 pt-6 py-8`,

![alt text](../../../static/img/tailwind/padding-concept-06.png)

it solved the problem, but come to mobile...
say i want `p-3` for mobile...
i cannot just update `p-3 sm:p-6`
i have to do `px-3 pt-3 pb-6 sm:px-6 sm:pt-6 sm:pt-8`

![alt text](../../../static/img/tailwind/padding-concept-07.png)

### Solution

Outer padding!
to make we easy update, we only set outer padding on first div, you know what i mean

eg: `p-6`

and more we have to make it flex-col right?

final: `p-6 flex flex-col`

![alt text](../../../static/img/tailwind/padding-concept-08.png)

When come to update their gap, we are very easy to control

eg: `p-6 flex flex-col` **`gap-6`**
![alt text](../../../static/img/tailwind/padding-concept-09.png)



