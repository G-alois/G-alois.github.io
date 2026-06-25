---
permalink: /visitor-map/
title: "Visitor Analytics"
excerpt: "Live visitor map"
author_profile: false
hide_page_reviewers: true
---

{% assign reviewers_host = site.url | remove: "https://" | remove: "http://" | split: "/" | first %}

<div
  class="visitor-dashboard"
  id="page-reviewers-map"
  data-reviewer-mode="dashboard"
  data-feedpulse-site-id="{{ site.feedpulse_site_id }}"
  data-feedpulse-host="{{ reviewers_host }}">
  <div class="page-reviewers__loading">Loading visitor analytics...</div>
</div>

<script defer src="{{ '/assets/js/page-reviewers.js' | relative_url }}"></script>
