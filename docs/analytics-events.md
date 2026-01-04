# Analytics Event Schema

WaterShortcut uses GA4 events for core product flows. All events are gated by analytics consent.

## Pageviews

| Event name | When it fires | Parameters |
| --- | --- | --- |
| `page_view` | On page load for worker-rendered pages, and on SPA route changes for the React app. | `page_path` (string), `page_location` (string), `page_title` (string) |

## Wizard flows

| Event name | When it fires | Parameters |
| --- | --- | --- |
| `ws_wizard_step_view` | When a wizard step is shown (including step 1 on load). | `wizard` (string), `step` (string), `step_index` (number) |
| `ws_wizard_start` | When the user advances from the first step. | `wizard` (string) |
| `ws_wizard_complete` | When the user advances into the final step. | `wizard` (string) |

## Calculators

| Event name | When it fires | Parameters |
| --- | --- | --- |
| `ws_calc_run` | When a calculator form is submitted. | `calc` (string) |

## Provider search

| Event name | When it fires | Parameters |
| --- | --- | --- |
| `ws_provider_search` | When the provider lookup form is submitted with a non-empty location. | `location_length` (number) |

## Bill analysis

| Event name | When it fires | Parameters |
| --- | --- | --- |
| `ws_bill_analyze_submit` | When a bill analysis upload is submitted with a PDF file. | `file_type` (string), `file_size_kb` (number) |
