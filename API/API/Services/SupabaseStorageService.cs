using Supabase;

namespace API.Services
{
    public class SupabaseStorageService
    {
        private readonly Supabase.Client _client;

        public SupabaseStorageService(IConfiguration config)
        {
            var url =
                Environment.GetEnvironmentVariable("SUPABASE_URL");

            var key =
                Environment.GetEnvironmentVariable("SUPABASE_KEY");

            _client = new Supabase.Client(url, key);

            _client.InitializeAsync().Wait();
        }

        public async Task<string> UploadImage(IFormFile file)
        {
            var fileName =
                $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            using var stream = file.OpenReadStream();

            using var ms = new MemoryStream();

            await stream.CopyToAsync(ms);

            var bytes = ms.ToArray();

            await _client.Storage
                .From("book-images")
                .Upload(
                    bytes,
                    fileName
                );

            return _client.Storage
                .From("book-images")
                .GetPublicUrl(fileName);
        }

        public async Task<string> UploadPreview(IFormFile file)
        {
            var fileName =
                $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            using var stream = file.OpenReadStream();

            using var ms = new MemoryStream();

            await stream.CopyToAsync(ms);

            var bytes = ms.ToArray();

            await _client.Storage
                .From("book-previews")
                .Upload(
                    bytes,
                    fileName
                );

            return _client.Storage
                .From("book-previews")
                .GetPublicUrl(fileName);
        }
    }
}