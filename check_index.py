from app import create_app
app = create_app()
with app.test_client() as c:
    res = c.get('/')
    html = res.get_data(as_text=True)
    print('status', res.status_code)
    print('has_chart:', 'cdn.jsdelivr.net/npm/chart.js' in html)
    print('has_speedtest:', 'static/js/speedtest.js' in html)
    print('has_canvas:', 'id="speedGauge"' in html)
