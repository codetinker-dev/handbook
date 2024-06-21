---
id: creating-a-component
title: Creating a component
tags:
  - Code
  - Standard
  - tailwind
sidebar_position: 3
---

# Creating a component

We know some of the scenario we creating reusable component for other page also.

![alt text](../../../static/img/tailwind/creating-a-component-01.png)

when creating reusable component, remember to make the component always take full width, meaning we use parent component to control the component

![alt text](../../../static/img/tailwind/creating-a-component-02.png)


dont set any margin in the reusable component!

eg: margin on reusable component A

it is hard to find why cause this, and it will affect the original flex-col

![alt text](../../../static/img/tailwind/creating-a-component-03.png)