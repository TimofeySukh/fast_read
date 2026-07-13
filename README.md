# OneWordText reading study

Can people read faster when words are shown one at a time, or when the same text is presented as an ordinary document?

This repository publishes the anonymized pilot analysis of the OneWordText experiment. The original Flask data-collection prototype is retained in the repository for historical context; the public website is a separate, static research report deployed by GitHub Actions.

## Live report

- [Open the research website](https://timofeysukh.github.io/Fast_read/)
- [Open the six-page PDF report](https://timofeysukh.github.io/Fast_read/output/pdf/onewordtext-pilot-study.pdf)
- [Download the anonymized analysis data](https://timofeysukh.github.io/Fast_read/data/analysis-results.json)

## Result in brief

The primary analysis includes four completed sessions from the current eight-segment protocol, covering 32 observed readings.

- Median ordinary PDF speed: **200.1 WPM**
- Median one-word RSVP speed: **95.2 WPM**
- Median PDF-to-RSVP speed ratio: **1.81x**
- PDF was faster for **3 of 4** participants
- Mean self-rated comprehension: **4.44/5 for PDF** and **3.56/5 for RSVP**

This is a small exploratory pilot, not confirmatory evidence. The bootstrap interval is wide, the sign tests are not statistically significant, reading order was not randomized, and some PDF timings indicate possible scanning or early completion.

## Repository structure

```text
.
├── .github/workflows/deploy-pages.yml  # validation and GitHub Pages deployment
├── site/                               # public research website
│   ├── index.html
│   ├── data/analysis-results.json      # anonymized results
│   └── output/pdf/                     # embedded report
├── app.py                              # archived Flask prototype
├── templates/                          # archived prototype interface
├── static/                             # archived prototype assets
└── docs/                               # original product notes
```

Participant names, email addresses, free-text responses, source filenames derived from names, and full session identifiers are not included in the published files. The private source archive must never be committed to this repository.

## Local preview

The published report has no build step or server-side dependency.

```bash
python3 -m http.server 8000 --directory site
```

Open `http://localhost:8000`.

## Deployment

Every push to `main` that changes `site/`, this README, or the Pages workflow runs the following pipeline:

1. Validate the HTML, PDF, and JSON artifacts.
2. Check the expected headline values and anonymized participant labels.
3. Upload `site/` as a GitHub Pages artifact.
4. Deploy the artifact to the `github-pages` environment.

The workflow can also be started manually from **Actions → Deploy research report to GitHub Pages → Run workflow**.

## Archived prototype

The earlier Flask experiment can still be run locally for historical inspection:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`. The prototype stores submitted feedback as local JSON and should not be exposed publicly without authentication, a privacy policy, retention controls, and secure storage.

## License

No license file is currently configured. Copyright remains with the repository owner.
