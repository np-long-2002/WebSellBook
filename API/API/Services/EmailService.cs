using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;

namespace API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(
    string to,
    string subject,
    string body)
        {
            Console.WriteLine("=== SEND MAIL START ===");
            Console.WriteLine($"TO: {to}");

            var email = new MimeMessage();

            email.From.Add(
                MailboxAddress.Parse(
                    _config["EmailSettings:Email"]
                ));

            email.To.Add(
                MailboxAddress.Parse(to));

            email.Subject = subject;

            email.Body = new TextPart("html")
            {
                Text = body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                _config["EmailSettings:Host"],
                int.Parse(_config["EmailSettings:Port"]),
                SecureSocketOptions.StartTls);

            Console.WriteLine("Connected SMTP");

            await smtp.AuthenticateAsync(
                _config["EmailSettings:Email"],
                _config["EmailSettings:Password"]);

            Console.WriteLine("Authenticated");

            await smtp.SendAsync(email);

            Console.WriteLine("Mail Sent");

            await smtp.DisconnectAsync(true);
        }
    }
}