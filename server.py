import http.server
import socketserver
import urllib.parse

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Lấy đường dẫn từ URL
        parsed_path = urllib.parse.urlparse(self.path).path
        
        # Chặn bất kỳ truy cập nào có chứa 'admin' trong đường dẫn
        if 'admin' in parsed_path.lower():
            self.send_error(403, "Access Denied: Admin features are restricted.")
            return
            
        # Nếu không phải admin, phục vụ file bình thường
        super().do_GET()

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"🚀 Local Server đang chạy tại: http://localhost:{PORT}")
    print("❌ Đã chặn các tính năng và trang Admin đối với end-user.")
    print("Nhấn Ctrl+C để tắt server.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer đã tắt.")
