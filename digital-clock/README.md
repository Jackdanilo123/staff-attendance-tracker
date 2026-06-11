# Digital Clock - Multi-Timezone Display

A beautiful, responsive digital clock application that displays the current time in multiple time zones around the world.

## Features

✅ **Real-time Clock Display**
- Live updating digital clock
- 12-hour and 24-hour format toggle
- Shows current date and day

✅ **Multiple Time Zones**
- Pre-configured popular time zones
- Add custom time zones
- Remove time zones
- Synchronized real-time updates

✅ **Interactive Features**
- Toggle between 12-hour and 24-hour format
- Add/remove time zones easily
- Search and filter time zones
- Smooth animations and transitions
- Dark and light mode (keyboard shortcut)

✅ **Responsive Design**
- Works on desktop, tablet, and mobile
- Beautiful gradient backgrounds
- Optimized UI for all screen sizes

## Quick Start

Simply open `index.html` in your web browser - no installation required!

```bash
# If you have Python 3
python -m http.server 8000

# If you have Python 2
python -m SimpleHTTPServer 8000

# Or use Node.js (http-server)
npx http-server
```

Then open: **http://localhost:8000**

## File Structure

```
digital-clock/
├── index.html           # Main HTML file
├── css/
│   └── styles.css       # All styling
├── js/
│   └── clock.js         # Clock logic
└── README.md            # This file
```

## Usage Guide

### Add a Time Zone

1. Click the **"+ Add Time Zone"** button
2. Select a time zone from the dropdown
3. Click **"Add"**
4. The time zone card will appear on the screen

### Remove a Time Zone

1. Find the time zone card you want to remove
2. Click the **"×"** (close) button on the card
3. The time zone will be removed

### Toggle Time Format

1. Click the **"Format"** button in the header
2. Time will switch between 12-hour (AM/PM) and 24-hour format

### Keyboard Shortcuts

- **T** - Toggle 12/24 hour format
- **D** - Toggle dark/light mode
- **A** - Open add time zone dialog
- **Esc** - Close dialog

## Default Time Zones

The clock comes pre-configured with these time zones:

- 🇺🇸 **New York** (America/New_York)
- 🇬🇧 **London** (Europe/London)
- 🇫🇷 **Paris** (Europe/Paris)
- 🇮🇳 **Mumbai** (Asia/Kolkata)
- 🇯🇵 **Tokyo** (Asia/Tokyo)
- 🇦🇺 **Sydney** (Australia/Sydney)
- 🇨🇦 **Toronto** (America/Toronto)
- 🇧🇷 **São Paulo** (America/Sao_Paulo)
- 🇦🇪 **Dubai** (Asia/Dubai)
- 🇸🇬 **Singapore** (Asia/Singapore)

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript** - Pure vanilla JS (no dependencies)
- **Intl API** - For timezone formatting

## Supported Time Zones

Supports all IANA time zone database entries including:
- Major cities worldwide
- Regional time zones
- UTC offsets
- Daylight saving time aware

## Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Performance

- Lightweight (< 50KB total)
- Smooth 60fps animations
- Minimal CPU usage
- Optimized rendering

## Customization

### Change Default Time Zones

Edit `js/clock.js` and modify the `DEFAULT_TIMEZONES` array:

```javascript
const DEFAULT_TIMEZONES = [
  'America/New_York',
  'Europe/London',
  // Add your preferred timezones
];
```

### Change Colors

Edit `css/styles.css` to modify the color variables:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  /* ... more colors ... */
}
```

## Tips & Tricks

1. **Organize by Time**: Add time zones that are relevant to your business or contacts
2. **Use Keyboard Shortcuts**: Toggle format with **T** for quick switching
3. **Dark Mode**: Use **D** to reduce eye strain during night viewing
4. **Mobile**: Swipe left/right on time zone cards to remove them

## Future Enhancements

- 🔔 Alarm functionality
- 📍 Location-based time zone detection
- 💾 Save preferred time zones to localStorage
- 📊 Time zone comparison tool
- 🎨 Multiple theme options
- 📱 PWA support

## License

MIT License - Feel free to use and modify

## Support

For issues or suggestions, create an issue in the repository.

---

**Created**: 2026 | **Version**: 1.0.0
