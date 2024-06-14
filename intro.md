---
title: Axelrod Model - introduction
author: Dawid Karpiński
date: 14.06.2024 r.
documentclass:
    - article
header-includes:
    - \usepackage{paralist}
    - \usepackage{booktabs}
    - \usepackage{numprint, xspace, paralist}
    - \usepackage{hyperref}
    - \usepackage{cleveref}
    - \usepackage[utf8]{inputenc}
    - \usepackage{fixltx2e}
    - \usepackage[T1]{fontenc}
    - \usepackage[margin=0.8in]{geometry}
    - \usepackage{braket}
    - \usepackage{enumitem}
    - \setlist[itemize]{leftmargin=0.1in}
---

The Axelrod model is a computational model proposed by Robert Axelrod to simulate the dissemination and evolution of cultural traits within a population. It is based on the principles of homophily (the tendency of individuals to interact with those who are similar to them) and cultural drift (the gradual change in cultural traits over time).

The model represents a population as a grid of cells, where each cell represents an individual agent. Each agent is characterized by a set of cultural features or traits, represented by a vector of values. Initially, these traits are randomly assigned to each agent. The model then proceeds in discrete time steps, during which agents interact with their immediate neighbors on the grid. The interaction involves comparing their respective trait vectors. If two neighboring agents have identical traits, they remain unchanged. However, if they differ in one or more traits, there is a probability that one agent will adopt the trait of the other, making them more similar.

This process of interaction and cultural convergence continues iteratively, leading to the emergence of distinct cultural regions or clusters within the population (fig. \ref{axelrod}). Over time, these clusters may grow, merge, or remain separate, depending on the initial conditions and the specific rules of the model.

![Example result of the Axelrod model simulation (20000 interactions, 5 features, 15 traits) \label{axelrod}](./axelrod.png){width=300px}

The Axelrod model captures the dynamics of cultural dissemination and the formation of cultural boundaries. It demonstrates how local interactions and homophily can lead to global patterns of cultural diversity or homogeneity, depending on the parameters of the model.
