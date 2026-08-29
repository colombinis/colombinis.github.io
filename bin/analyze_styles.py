import json, re, urllib.request

contacto_html = urllib.request.urlopen('http://127.0.0.1:8004/contacto/').read().decode()
index_html = urllib.request.urlopen('http://127.0.0.1:8004/').read().decode()

# Get CSS links from contacto
contacto_css = re.findall(r'href="/_astro/([^"]+\.css)"', contacto_html)
index_css = re.findall(r'href="/_astro/([^"]+\.css)"', index_html)

print("Contacto CSS:", contacto_css)
print("Index CSS:", index_css)

# Get Layout CSS content and check :root
layout_css_url = 'http://127.0.0.1:8004/_astro/' + [c for c in contacto_css if 'Layout' in c][0]
layout_css = urllib.request.urlopen(layout_css_url).read().decode()

# Extract :root
root_match = re.search(r':root\{([^}]*)\}', layout_css)
if root_match:
    vars = dict(re.findall(r'--([\w-]+):([^;]+);', root_match.group(1)))
    print("\n:root variables:")
    for k, v in vars.items():
        print(f"  --{k}: {v.strip()}")

# Check body styles
body_match = re.search(r'body\{([^}]*)\}', layout_css)
if body_match:
    print("\nbody styles:", body_match.group(1))

# Check h1,h2,h3 styles
h_match = re.search(r'h1,h2,h3\{([^}]*)\}', layout_css)
if h_match:
    print("h1,h2,h3 styles:", h_match.group(1))

# Check a styles
a_match = re.search(r'a\{([^}]*)\}', layout_css)
if a_match:
    print("a styles:", a_match.group(1))

# Now check contacto-specific CSS
contacto_css_url = 'http://127.0.0.1:8004/_astro/' + [c for c in contacto_css if 'contacto' in c][0]
contacto_css_content = urllib.request.urlopen(contacto_css_url).read().decode()

# Check if the contacto CSS uses var() references
var_usages = re.findall(r'var\(--([\w-]+)\)', contacto_css_content)
print("\nCSS variables used in contacto.css:", set(var_usages))

# Check the order of CSS in head
head_start = contacto_html.find('<head>')
head_end = contacto_html.find('</head>')
head = contacto_html[head_start:head_end]
css_order = re.findall(r'href="/_astro/([^"]+\.css)"', head)
print("\nCSS load order:", css_order)
