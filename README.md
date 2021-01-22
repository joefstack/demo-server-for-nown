## Demo server for Nown

Quick demo server written in nodejs. Endpoint /send-email takes in req body parameters to from subject body_text body_html, validates input and checks database if email is on bounced email list. Instantiates to either AWS SES or SendGrid email service.

Endpoint /bounced-email takes in req body parameter email_address, validates email and saves it to database if not a copy 