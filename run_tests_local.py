from app import create_app

app = create_app()

with app.test_client() as c:
    print('Testing /ping')
    res = c.get('/ping')
    print(res.status_code, res.get_json())

    print('Testing /download')
    res = c.get('/download')
    print(res.status_code, res.headers.get('Content-Length'))

    print('Testing /upload')
    data = b'x' * (1 * 1024 * 1024)
    res = c.post('/upload', data=data)
    print(res.status_code, res.get_json())
