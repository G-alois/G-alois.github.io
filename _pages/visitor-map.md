---
permalink: /visitor-map/
title: "Visitor Analytics"
excerpt: "City-level visitor map"
author_profile: false
hide_page_reviewers: true
---

<div class="visitor-dashboard visitor-dashboard--mapmyvisitors">
  <div class="visitor-dashboard__shell">
    <div class="visitor-dashboard__header">
      <div>
        <p class="visitor-dashboard__eyebrow">Live visitor map</p>
        <h2>City-Level Analytics</h2>
        <p>g-alois.github.io</p>
      </div>
      <a class="visitor-dashboard__home" href="/">Back to homepage</a>
    </div>

    <div class="visitor-dashboard__main visitor-dashboard__main--single">
      <div class="visitor-dashboard__map-panel visitor-dashboard__map-panel--official">
        <div class="visitor-dashboard__panel-title">MapMyVisitors live map</div>
        {% include mapmyvisitors-widget.html class="mapmyvisitors-widget-frame" %}
      </div>
    </div>

    <div class="visitor-dashboard__footer">
      <span>Full city-level details are hosted by MapMyVisitors.</span>
      <a href="{{ site.mapmyvisitors_stats_url }}" target="_blank" rel="noopener">Open full analytics</a>
    </div>
  </div>
</div>
