// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// Target the custom scroll container since body is hidden
const scroller = ".scroll-container";

// --- 1. INTRO ANIMATION ---
const tl = gsap.timeline();

// Draw SVG text
tl.to(".svg-text text", {
    strokeDashoffset: 0,
    duration: 3,
    ease: "power2.inOut"
})
// Fill the text with white slowly
.to(".svg-text text", {
    fill: "#ffffff",
    duration: 1
}, "-=1")
// Dissolve into blur and scale up
.to(".intro-content", {
    opacity: 0,
    scale: 1.2,
    filter: "blur(15px)",
    duration: 1.5,
    ease: "power2.in"
}, "+=1")
// Remove intro screen
.set("#intro", { display: "none" })
// Fade in the calendar
.to("#calendar-wrapper", {
    opacity: 1,
    duration: 1
});


// --- 2. SCROLL & SECTION ANIMATIONS ---
const sections = document.querySelectorAll('.memory-section');
const calendarPaper = document.querySelector('.calendar-paper');
const calendarYearText = document.querySelector('#calendar-year');

let currentYear = "";

sections.forEach((sec) => {
    let year = sec.getAttribute('data-year');
    
    // Sub-elements to animate inside section
    let animateElements = sec.querySelectorAll('.animate-up');
    let images = sec.querySelectorAll('.img-placeholder');

    // ScrollTrigger for entering/leaving the section
    ScrollTrigger.create({
        trigger: sec,
        scroller: scroller,
        start: "top 50%", 
        end: "bottom 50%",
        onEnter: () => triggerSection(year, animateElements),
        onEnterBack: () => triggerSection(year, animateElements),
        onLeave: () => hideSection(animateElements),
        onLeaveBack: () => hideSection(animateElements)
    });

    // Set initial state for elements
    gsap.set(animateElements, { opacity: 0, y: 40 });

    // Subtle floating effect for images (Active state)
    if(images.length > 0) {
        gsap.to(images, {
            y: "+=15",
            duration: 4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: 0.5 // Offsets the float slightly between the two images
        });
    }
});

// Function to handle the transition logic
function triggerSection(year, elements) {
    // 1. Fade in the text/images
    gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        overwrite: "auto"
    });

    // 2. Trigger Calendar Tear if year changed
    if (year !== currentYear && year !== null) {
        tearCalendar(year);
        currentYear = year;
    }
}

// Function to fade out when scrolling past
function hideSection(elements) {
    gsap.to(elements, {
        opacity: 0,
        y: -40,
        duration: 0.5,
        ease: "power2.in",
        overwrite: "auto"
    });
}

// --- 3. CALENDAR TEAR ANIMATION ---
function tearCalendar(newYear) {
    let tearTl = gsap.timeline();

    // The old page drops down and rotates out
    tearTl.to(calendarPaper, {
        y: 80,
        rotationZ: 15,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
    })
    // Update the text while invisible
    .call(() => {
        calendarYearText.innerText = newYear;
    })
    // The new page falls into place from above
    .fromTo(calendarPaper, 
        { y: -60, rotationZ: -10, opacity: 0 },
        { y: 0, rotationZ: 0, opacity: 1, duration: 0.6, ease: "back.out(1.2)" }
    );
}
