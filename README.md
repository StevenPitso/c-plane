# C-Plane

**A graphing engine built from scratch with JavaScript and HTML Canvas.**

It has been about a year since I last touched this codebase.

When I first built C-Plane, I was mainly interested in making something that worked. I wanted to draw a coordinate plane, take an equation, evaluate it, and put the result on a Canvas. At the time, that was enough.

A year later, I've come back to the project with a very different understanding of software development.

Since then, I've worked with larger codebases, built applications from scratch, worked with APIs and databases, written code in multiple languages, and spent much more time thinking about **architecture, abstractions, algorithms, and what is actually happening underneath the tools I use.**

So instead of simply adding another feature to the old version, I'm rebuilding C-Plane.

## A year apart

C-Plane has two versions: the original project that I built a year ago and the new implementation I'm working on today.

| Original | Rebuilt |
|---|---|
| [C-Plane v1](https://github.com/StevenPitso/C-plane/tree/main) | [C-Plane v2](https://github.com/StevenPitso/C-plane) |
| Initial graphing prototype | Rebuilt graphing engine |
| Basic equation evaluation | Custom mathematical engine |
| Early Canvas implementation | More deliberate rendering architecture |

The screenshots below capture the difference between where the project started and where it's heading.

![C-Plane: Original and rebuilt versions](demos/image.png)

*Same project, roughly a year apart. A reminder of how much can change when you revisit something with more experience.*

## What changed?

The original version was essentially:

> **input → evaluate → draw**

And that was fine for where I was at the time.

But looking back at the code now, I can see how much of the complexity was being hidden or avoided.

The old implementation relied heavily on JavaScript's own evaluation capabilities. The coordinate system, graph rendering, input handling, and mathematical logic were also much more tightly coupled than I would design them today.

That is exactly why I decided to come back to it.

I don't want C-Plane to be another project where I import a mathematical library, call a graphing function, and move on.

I want to understand how the thing actually works.
