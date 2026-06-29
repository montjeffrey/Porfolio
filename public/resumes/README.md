# Resume PDFs

Drop your resume PDF files in this folder using these **exact** filenames.
The site loads them from `/resumes/<name>.pdf`, so the names must match or the
download/view buttons will 404.

| Required filename            | Used by                                                        |
| ---------------------------- | ------------------------------------------------------------- |
| `technical.pdf`              | Resume Hub (View/Download) + homepage "Download Resume" modal  |
| `public-info.pdf`            | Resume Hub (View/Download) + homepage "Download Resume" modal  |
| `solutions-engineer.pdf`     | Resume Hub (View/Download)                                     |

Referenced in:
- `app/resume/page.tsx` (`/resumes/${resumeId}.pdf`)
- `components/ui/resume-modal.tsx` (`/resumes/${resumeId}.pdf`)

Once the three PDFs are added here, every resume link on the site will work.
