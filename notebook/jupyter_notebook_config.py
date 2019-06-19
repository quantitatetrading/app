c = get_config()
c.NotebookApp.ip = '0.0.0.0'
c.NotebookApp.open_browser = False
c.NotebookApp.tornado_settings={"headers":{"Content-Security-Policy": """
default-src *  data: blob: 'unsafe-inline' 'unsafe-eval';
script-src * data: blob: 'unsafe-inline' 'unsafe-eval';
connect-src * data: blob: 'unsafe-inline';
img-src * data: blob: 'unsafe-inline';
frame-src * data: blob: ;
style-src * data: blob: 'unsafe-inline';
font-src * data: blob: 'unsafe-inline';

"""}}

c.FileContentsManager.delete_to_trash = False
