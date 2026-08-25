/**
 * ==========================================================================
 * AMSTERDAM LUXURY — JAVASCRIPT CONTROLLER
 * Location: Agadir, Morocco
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    init_navbar_behavior();
    init_mobile_drawer();
    init_menu_tabs();
    init_gallery_filter_tabs();
    init_gallery_lightbox();
    init_reservation_form();
    init_scroll_to_top();
    init_aos_animations();
    init_smooth_scroll_links();
});

/**
 * 1. Navbar scroll effect and sticky blur transition
 */
function init_navbar_behavior() {
    const navbar = document.querySelector('.header_navbar');
    if (!navbar) return;

    const handle_scroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handle_scroll, { passive: true });
    handle_scroll();
}

/**
 * 2. Luxury Sidebar Drawer Navigation
 */
function init_mobile_drawer() {
    const toggle_buttons = document.querySelectorAll('.header_menu_toggle_btn, .mobile_toggler');
    const drawers = document.querySelectorAll('.luxury_sidebar_drawer, .mobile_nav_drawer');
    const backdrops = document.querySelectorAll('.drawer_backdrop');
    const close_buttons = document.querySelectorAll('.drawer_close_btn');
    const drawer_links = document.querySelectorAll('.drawer_link');

    if (!toggle_buttons.length || !drawers.length) return;

    const open_drawer = () => {
        drawers.forEach(d => d.classList.add('open'));
        backdrops.forEach(b => b.classList.add('open'));
        document.body.style.overflow = 'hidden';
    };

    const close_drawer = () => {
        drawers.forEach(d => d.classList.remove('open'));
        backdrops.forEach(b => b.classList.remove('open'));
        document.body.style.overflow = '';
    };

    toggle_buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            open_drawer();
        });
    });

    close_buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            close_drawer();
        });
    });

    backdrops.forEach(backdrop => {
        backdrop.addEventListener('click', close_drawer);
    });

    drawer_links.forEach(link => {
        link.addEventListener('click', close_drawer);
    });

    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            close_drawer();
        }
    });
}

/**
 * 3. Menu Category Tab Filtering
 */
function init_menu_tabs() {
    const tab_buttons = document.querySelectorAll('.menu_tab_btn');
    const menu_items = document.querySelectorAll('.menu_item_col');

    if (!tab_buttons.length) return;

    tab_buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            tab_buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');

            menu_items.forEach(item => {
                const item_cat = item.getAttribute('data-category');
                if (category === 'all' || item_cat === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * 4. Gallery Category Filter Tabs (Uniform Square Grid)
 */
function init_gallery_filter_tabs() {
    const filter_buttons = document.querySelectorAll('.gallery_filter_btn');
    const gallery_items = document.querySelectorAll('.gallery_item');

    if (!filter_buttons.length) return;

    filter_buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            filter_buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter_val = btn.getAttribute('data-filter') || 'all';

            gallery_items.forEach(item => {
                const item_filter = item.getAttribute('data-filter');
                if (filter_val === 'all' || item_filter === filter_val) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * 5. Gallery Lightbox Modal Handler
 */
function init_gallery_lightbox() {
    const gallery_items = document.querySelectorAll('.gallery_item');
    const modal_el = document.getElementById('gallery_lightbox_modal');
    if (!modal_el) return;

    const modal_img = document.getElementById('lightbox_modal_img');
    const modal_title = document.getElementById('lightbox_modal_title');
    const modal_cat = document.getElementById('lightbox_modal_category');

    gallery_items.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery_img');
            const title = item.querySelector('.gallery_caption_title');
            const cat = item.querySelector('.gallery_caption_cat');

            if (img && modal_img) modal_img.src = img.getAttribute('src');
            if (title && modal_title) modal_title.textContent = title.textContent;
            if (cat && modal_cat) modal_cat.textContent = cat.textContent;

            const bs_modal = bootstrap.Modal.getOrCreateInstance(modal_el);
            bs_modal.show();
        });
    });
}

/**
 * 6. Reservation Form Validation & WhatsApp Booking Engine
 */
function init_reservation_form() {
    const form = document.getElementById('reservation_form');
    if (!form) return;

    // Set default date to today
    const date_input = document.getElementById('res_date');
    if (date_input) {
        const today = new Date().toISOString().split('T')[0];
        date_input.min = today;
        date_input.value = today;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('res_name')?.value.trim();
        const phone = document.getElementById('res_phone')?.value.trim();
        const email = document.getElementById('res_email')?.value.trim();
        const date = document.getElementById('res_date')?.value;
        const time = document.getElementById('res_time')?.value;
        const guests = document.getElementById('res_guests')?.value;
        const seating = document.getElementById('res_seating')?.value || 'Main Dining';
        const message = document.getElementById('res_notes')?.value.trim() || 'No special requests';

        if (!name || !phone || !date || !time || !guests) {
            show_luxury_toast('Missing Details', 'Please complete all required fields for your reservation.');
            return;
        }

        // Generate prefilled WhatsApp booking message
        const wa_text = encodeURIComponent(
            `*TABLE RESERVATION REQUEST — AMSTERDAM LUXURY*\n\n` +
            `👤 *Guest Name:* ${name}\n` +
            `📞 *Phone:* ${phone}\n` +
            `📧 *Email:* ${email || 'N/A'}\n` +
            `📅 *Date:* ${date}\n` +
            `⏰ *Time:* ${time}\n` +
            `👥 *Guests:* ${guests} Person(s)\n` +
            `✨ *Seating Area:* ${seating}\n` +
            `📝 *Special Notes:* ${message}\n\n` +
            `_Requested via Amsterdam Luxury Official Website_`
        );

        const wa_url = `https://wa.me/212609070598?text=${wa_text}`;

        // Show confirmation modal
        const confirm_modal_el = document.getElementById('reservation_confirm_modal');
        if (confirm_modal_el) {
            document.getElementById('confirm_guest_name').textContent = name;
            document.getElementById('confirm_datetime').textContent = `${date} at ${time}`;
            document.getElementById('confirm_guests').textContent = `${guests} Guests (${seating})`;
            
            const wa_confirm_btn = document.getElementById('confirm_wa_redirect_btn');
            if (wa_confirm_btn) {
                wa_confirm_btn.href = wa_url;
            }

            const bs_confirm = bootstrap.Modal.getOrCreateInstance(confirm_modal_el);
            bs_confirm.show();
        }

        show_luxury_toast('Reservation Form Received', 'Your VIP table request is ready. Click below to verify via WhatsApp.');
        form.reset();
    });
}

/**
 * 7. Floating Back to Top Button
 */
function init_scroll_to_top() {
    const top_btn = document.getElementById('back_to_top_btn');
    if (!top_btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            top_btn.classList.add('visible');
        } else {
            top_btn.classList.remove('visible');
        }
    }, { passive: true });

    top_btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 8. Smooth Navigation Links
 */
function init_smooth_scroll_links() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const target_id = this.getAttribute('href');
            if (target_id === '#' || target_id === '') return;

            const target_el = document.querySelector(target_id);
            if (target_el) {
                e.preventDefault();
                target_el.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 9. Toast Notification Trigger
 */
function show_luxury_toast(title, subtitle) {
    let toast = document.getElementById('luxury_live_toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'luxury_live_toast';
        toast.className = 'toast_custom';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <i class="bi bi-check2-circle toast_icon"></i>
        <div>
            <div class="toast_msg_title">${title}</div>
            <div class="toast_msg_sub">${subtitle}</div>
        </div>
    `;

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

/**
 * 10. AOS (Animate on Scroll) Initialization
 */
function init_aos_animations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 850,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            once: true,
            offset: 80,
            disable: function() {
                return window.innerWidth <= 480;
            }
        });
    }
}
