# Google Ads Tracking Setup — Landing Pages

For Nick. This explains what's already automatic on our `/lp/` landing pages, and the one thing you need to set up on the Google Ads side so every lead comes into the CRM tagged with its campaign and ad group.

## What already happens automatically

Every `/lp/` page (pressure-washing, soft-washing, surface-cleaning, roof-washing, gutter-cleaning, brand-awareness) has tracking built in. When someone clicks an ad and lands on the page, the page automatically grabs:

- The Google click ID (`gclid`, or `gbraid`/`wbraid` on newer Google Ads formats)
- Any UTM parameters in the URL (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`)
- The landing page path itself (e.g. `/lp/pressure-washing/`)

All of that gets sent into the CRM the moment the person submits the form — no action needed on your end for this part, it's already live.

## What YOU need to do in Google Ads

Set a **Final URL suffix**. This is a Google Ads setting (found at the account level or on individual campaigns, under Settings) that automatically appends tracking parameters to every ad's destination URL — you don't touch the ad URLs themselves.

Set the Final URL suffix to:

```
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}&utm_term={keyword}
```

The `{campaignid}`, `{adgroupid}`, and `{keyword}` parts are Google "ValueTrack" parameters — Google fills them in automatically with the real numeric campaign ID, ad group ID, and the keyword that triggered the ad, on every single click. You set this once and never touch it again.

**Alternative if you'd rather see names instead of ID numbers:** Google's `{campaignid}` and `{adgroupid}` come through as numbers, not the readable names you gave your campaigns in the Ads dashboard. If you'd prefer to see "Spring2026-Pressure" instead of "48213902" in the CRM, you can skip the Final URL suffix and instead manually add UTM parameters to each ad's URL with the campaign/ad group name spelled out (e.g. `utm_campaign=spring2026-pressure&utm_content=broad-match`). More manual work per campaign, but easier to read at a glance. Your call — the ID-number approach above is less maintenance if you're running a lot of campaigns.

## Where the data shows up

Once this is set, every lead that comes in through a landing page will show, right on the lead record in the CRM:

- **Landing page** — which of the 6 pages they filled out the form on
- **Campaign** — which Google Ads campaign the click came from
- **Ad group** — which ad group within that campaign

This lets you see which pages and which campaigns are actually producing leads, not just which are getting clicks.

## One page per ad set (for now)

Right now the setup is one ad set → one landing page (e.g. your pressure washing ad set points at `/lp/pressure-washing/`). Since the landing page is now tracked on every lead separately from the campaign/ad group, this sets us up to later run multiple page variants under the same ad set (A/B testing different headlines or layouts) and still be able to tell which version converted better — no extra work needed when we get there.

## Ad destination URLs to use

Point your ads at the clean page URL, with the trailing slash:

- `https://carolinacleaningboys.com/lp/pressure-washing/`
- `https://carolinacleaningboys.com/lp/soft-washing/`
- `https://carolinacleaningboys.com/lp/surface-cleaning/`
- `https://carolinacleaningboys.com/lp/roof-washing/`
- `https://carolinacleaningboys.com/lp/gutter-cleaning/`
- `https://carolinacleaningboys.com/lp/brand-awareness/`

Don't add your own `?utm_...` params to these URLs if you're using the Final URL suffix above — Google appends the suffix automatically, and doubling up on parameters can cause conflicts.
