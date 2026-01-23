import { render } from "@react-email/components";
import { Resend } from "resend";
import { NewContentEmail } from "./email-templates/new-content";
import { NewsletterEmail } from "./email-templates/newsletter";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailRecipient = {
  email: string;
  name?: string;
};

type SendEmailResult = {
  success: boolean;
  emailId?: string;
  error?: string;
};

type BulkEmailResult = {
  totalSent: number;
  totalFailed: number;
  successful: Array<{ email: string; emailId: string }>;
  failed: Array<{ email: string; error: string }>;
};

export class EmailMarketingService {
  /**
   * Process settled promise results and update the bulk result object
   */
  private processSettledResults<T extends EmailRecipient>(
    settledResults: PromiseSettledResult<{
      recipient: T;
      result: SendEmailResult;
    }>[],
    batch: T[],
    results: BulkEmailResult
  ): void {
    for (const settled of settledResults) {
      if (settled.status === "fulfilled") {
        const { recipient, result } = settled.value;
        if (result.success && result.emailId) {
          results.totalSent += 1;
          results.successful.push({
            email: recipient.email,
            emailId: result.emailId,
          });
        } else {
          results.totalFailed += 1;
          results.failed.push({
            email: recipient.email,
            error: result.error || "Unknown error",
          });
        }
      } else {
        // Handle unexpected rejection (shouldn't happen with sendEmail's try/catch)
        const recipient = batch[settledResults.indexOf(settled)];
        results.totalFailed += 1;
        results.failed.push({
          email: recipient?.email || "unknown",
          error: settled.reason?.message || "Unexpected error",
        });
      }
    }
  }

  // biome-ignore lint/nursery/useMaxParams: this is a valid use case
  async sendEmail(
    recipient: EmailRecipient,
    subject: string,
    htmlContent: string,
    textContent?: string,
    fromName?: string,
    fromEmail?: string,
    replyTo?: string
  ): Promise<SendEmailResult> {
    try {
      const from = fromEmail
        ? `${fromName || "Nauris Linde"} <${fromEmail}>`
        : process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

      const result = await resend.emails.send({
        from,
        to: recipient.email,
        subject,
        html: htmlContent,
        text: textContent,
        replyTo,
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message,
        };
      }

      return {
        success: true,
        emailId: result.data?.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }

  // biome-ignore lint/nursery/useMaxParams: this is a valid use case
  async sendBulkEmails(
    recipients: EmailRecipient[],
    subject: string,
    htmlContent: string,
    textContent?: string,
    fromName?: string,
    fromEmail?: string,
    replyTo?: string
  ): Promise<BulkEmailResult> {
    const results: BulkEmailResult = {
      totalSent: 0,
      totalFailed: 0,
      successful: [],
      failed: [],
    };

    // Send emails in batches to avoid rate limiting - configurable via environment
    const batchSize = Number.parseInt(process.env.EMAIL_BATCH_SIZE || "10", 10);
    const batchDelay = Number.parseInt(
      process.env.EMAIL_BATCH_DELAY_MS || "1000",
      10
    );

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const promises = batch.map(async (recipient) => {
        const result = await this.sendEmail(
          recipient,
          subject,
          htmlContent,
          textContent,
          fromName,
          fromEmail,
          replyTo
        );
        return { recipient, result };
      });

      const settledResults = await Promise.allSettled(promises);
      this.processSettledResults(settledResults, batch, results);

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => {
          setTimeout(resolve, batchDelay);
        });
      }
    }

    return results;
  }

  async sendNewsletterEmail(
    recipients: Array<EmailRecipient & { unsubscribeToken: string }>,
    subject: string,
    content: string
  ): Promise<BulkEmailResult> {
    const results: BulkEmailResult = {
      totalSent: 0,
      totalFailed: 0,
      successful: [],
      failed: [],
    };

    const baseUrl = process.env.VITE_BASE_URL || "http://localhost:3000";

    // Send emails individually with personalized unsubscribe links
    const batchSize = Number.parseInt(process.env.EMAIL_BATCH_SIZE || "10", 10);
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const promises = batch.map(async (recipient) => {
        const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${recipient.unsubscribeToken}`;
        const htmlContent = await render(
          NewsletterEmail({
            subject,
            content,
            unsubscribeUrl,
          })
        );
        const textContent = this.stripHtml(content);

        const result = await this.sendEmail(
          { email: recipient.email, name: recipient.name },
          subject,
          htmlContent,
          textContent
        );
        return { recipient, result };
      });

      const settledResults = await Promise.allSettled(promises);
      this.processSettledResults(settledResults, batch, results);

      if (i + batchSize < recipients.length) {
        const delay = Number.parseInt(
          process.env.EMAIL_BATCH_DELAY_MS || "1000",
          10
        );
        await new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
      }
    }

    return results;
  }

  // biome-ignore lint/nursery/useMaxParams: this is a valid use case
  async sendNewContentNotification(
    recipients: Array<EmailRecipient & { unsubscribeToken: string }>,
    contentTitle: string,
    contentDescription: string,
    contentUrl: string,
    contentType: "blog" | "project" | "snippet"
  ): Promise<BulkEmailResult> {
    const results: BulkEmailResult = {
      totalSent: 0,
      totalFailed: 0,
      successful: [],
      failed: [],
    };

    const baseUrl = process.env.VITE_BASE_URL || "http://localhost:3000";
    const subject = `New ${contentType}: ${contentTitle}`;

    // Send emails individually with personalized unsubscribe links
    const batchSize = Number.parseInt(process.env.EMAIL_BATCH_SIZE || "10", 10);
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const promises = batch.map(async (recipient) => {
        const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${recipient.unsubscribeToken}`;
        const htmlContent = await render(
          NewContentEmail({
            title: contentTitle,
            description: contentDescription,
            contentUrl,
            contentType,
            unsubscribeUrl,
          })
        );
        const textContent = `New ${contentType}: ${contentTitle}\n\n${contentDescription}\n\nRead more: ${contentUrl}`;

        const result = await this.sendEmail(
          { email: recipient.email, name: recipient.name },
          subject,
          htmlContent,
          textContent
        );
        return { recipient, result };
      });

      const settledResults = await Promise.allSettled(promises);
      this.processSettledResults(settledResults, batch, results);

      if (i + batchSize < recipients.length) {
        const delay = Number.parseInt(
          process.env.EMAIL_BATCH_DELAY_MS || "1000",
          10
        );
        await new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
      }
    }

    return results;
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}

export const emailMarketingService = new EmailMarketingService();
