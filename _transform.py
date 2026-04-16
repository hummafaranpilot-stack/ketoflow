import re

with open('update.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Pattern to match each <tr data-refid="..."> ... </tr> block
pattern = re.compile(
    r'<tr data-refid="(?P<refid>[^"]+)"><td><div class="tbl-thumb"><div class="tbl-close" data-refid="[^"]+"><span>&times;</span></div><img src="(?P<src>[^"]+)" alt=""></div></td>\s*'
    r'<td><code>(?P<file>[^<]+)</code></td><td>(?P<line>[^<]+)</td>\s*'
    r'<td>(?P<usage>.*?)</td>\s*'
    r'<td><span class="tag tag-red">Pending</span></td></tr>',
    re.DOTALL
)

def replace(m):
    refid = m.group('refid')
    src = m.group('src')
    fname = m.group('file')
    line = m.group('line')
    usage = m.group('usage').strip()
    return (
        f'    <div class="card ref-card" data-refid="{refid}">\n'
        f'      <div class="thumb"><img src="{src}" alt="">\n'
        f'        <div class="loc"><span class="fileline">{fname}:{line}</span></div>\n'
        f'      </div>\n'
        f'      <div class="info">\n'
        f'        <div class="usage">{usage}</div>\n'
        f'        <div class="meta"><span class="tag tag-red">Pending</span></div>\n'
        f'      </div>\n'
        f'    </div>'
    )

new_html = pattern.sub(replace, html)

# Also close the grid properly — find "</table>" and replace with "</div>"
new_html = new_html.replace('  </table>\n</section>', '  </div>\n</section>', 1)

# Remove any stray comment blocks that are now just inside a grid
with open('update.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

count = len(pattern.findall(html))
print(f'Transformed {count} rows to cards')
