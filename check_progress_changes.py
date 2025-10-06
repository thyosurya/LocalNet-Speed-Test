from app import create_app
app = create_app()
with app.test_client() as c:
    res = c.get('/')
    html = res.get_data(as_text=True)
    print('status', res.status_code)
    print('has_progress_fill:', 'id="gaugeProgressFill"' in html)
    print('has_progress_label:', 'id="gaugeProgressLabel"' in html)
    s = open('static/js/speedtest.js').read()
    print('has_colorForSpeed:', 'function colorForSpeed' in s)
