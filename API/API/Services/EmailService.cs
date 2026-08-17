using Resend;

namespace API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IResend _resend;

        public EmailService(IResend resend)
        {
            _resend = resend;
        }

        public async Task SendEmailAsync(
            string to,
            string subject,
            string body)
        {
            var message = new EmailMessage
            {
                From = "onboarding@resend.dev",
                Subject = subject,
                HtmlBody = body
            };

            message.To.Add(to);

            var result = await _resend.EmailSendAsync(message);

            Console.WriteLine($"Email Sent: {result.Content}");
        }
    }
}