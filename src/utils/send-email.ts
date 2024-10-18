import { error } from "console";
import { Resend } from "resend";

export async function sendEmail(email, tokenId) {
  const resend = new Resend(process.env.RESEND_KEY);

  const { data, error } = await resend.emails.send({
    from: "Guilherme <short-url@guilhermearanega.com.br>",
    to: [email],
    subject: "Login into your account",
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html dir="ltr" lang="en">

                  <head>
                    <link rel="preload" as="image" href="https://react-email-demo-3kjjfblod-resend.vercel.app/static/linear-logo.png" />
                    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                    <meta name="x-apple-disable-message-reformatting" /><!--$-->
                  </head>
                  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Your login code for Short url<div></div>
                  </div>

                  <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;margin:0 auto;padding:20px 0 48px">
                      <tbody>
                        <tr style="width:100%">
                            <h1 style="font-size:24px;letter-spacing:-0.5px;line-height:1.3;font-weight:400;color:#484848;padding:17px 0 0">Your login code for Short url</h1>
                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:27px 0 27px">
                              <tbody>
                                <tr>
                                  <td><a href="http://localhost:3000/auth/${tokenId}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#5e6ad2;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-align:center;padding:11px 23px 11px 23px" target="_blank"><span><!--[if mso]><i style="mso-font-width:383.33333333333337%;mso-text-raise:16.5" hidden>&#8202;&#8202;&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:8.25px">Login to Linear</span><span><!--[if mso]><i style="mso-font-width:383.33333333333337%" hidden>&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span></a></td>
                                </tr>
                              </tbody>
                            </table>
                            <p style="font-size:15px;line-height:1.4;margin:0 0 15px;color:#3c4149">This link will only be valid for the next 15 minutes. If the link does not work, you can copy and paste this link into your browser: </p><code style="font-family:monospace;font-weight:700;padding:1px 4px;background-color:#dfe1e4;letter-spacing:-0.3px;font-size:21px;border-radius:4px;color:#3c4149">http://localhost:3000/auth/${tokenId}</code>
                          </td>
                        </tr>
                      </tbody>
                    </table><!--/$-->
                  </body>
                </html>`,
  });
  if (error) {
    throw new Error(error.message);
  }
}
