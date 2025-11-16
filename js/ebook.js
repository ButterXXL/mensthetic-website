// Ebook Download Functions

function downloadFreeEbook() {
    // Track free download
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'Ebook',
            'event_label': 'Free Haarausfall Guide'
        });
    }
    
    // Simulate download - in real implementation, trigger actual download
    alert('Vielen Dank! Der kostenlose Download "Wie ich Haarausfall besiegt habe" startet in Kürze.\n\nSie erhalten außerdem eine E-Mail mit weiteren wertvollen Tipps.');
    
    // Optional: Open contact form for email collection
    // scrollToSection('sec.menst-cta-booking');
}

function buyPremiumEbook() {
    // Track premium version interest
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'Ebook',
            'event_label': 'Premium Version Interest'
        });
    }
    
    // Open premium purchase modal or redirect
    const premiumModal = `
        <div style="
            position: fixed; 
            top: 0; left: 0; 
            width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); 
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        " onclick="this.remove()">
            <div style="
                background: white; 
                padding: 2rem; 
                border-radius: 15px; 
                max-width: 400px;
                text-align: center;
            " onclick="event.stopPropagation()">
                <h3 style="color: #0E6BFF; margin-bottom: 1rem;">Premium Version - 39€</h3>
                <p style="margin-bottom: 1.5rem;">Die erweiterte Version enthält:</p>
                <ul style="text-align: left; margin-bottom: 2rem;">
                    <li>✅ Detaillierte Behandlungspläne</li>
                    <li>✅ Exklusive Experteninterviews</li>
                    <li>✅ Persönliche Erfolgsstrategien</li>
                    <li>✅ Bonus: Video-Tutorials</li>
                </ul>
                <button class="btn--menst-primary" onclick="window.open('mailto:info@mensthetic.de?subject=Premium Ebook Bestellung&body=Ich möchte die Premium Version des Haarausfall-Guides für 39€ bestellen.', '_blank')">
                    Jetzt bestellen - 39€
                </button>
                <br><br>
                <button onclick="this.closest('div').remove()" style="background: none; border: none; color: #666;">
                    Schließen
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', premiumModal);
}