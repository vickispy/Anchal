/* =========================================================
   BOYFRIEND DAY — MAIN SCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =======================================================
       BASIC STATE
    ======================================================= */
  
    let currentScene = "scene-opening";
  
    let memoriesOpened = new Set();
  
    let currentPhoto = 0;
  
    let currentLetterPage = 1;
  
    let reasonsOpened = new Set();
  
    const photos = [
      {
        src: "assets/images/photo-01.jpg",
        caption: "that smile ❤️"
      },
      {
        src: "assets/images/photo-02.jpg",
        caption: "us 🥹"
      },
      {
        src: "assets/images/photo-03.jpg",
        caption: "my favourite"
      },
      {
        src: "assets/images/photo-04.jpg",
        caption: "this moment 🫶🏻"
      },
      {
        src: "assets/images/photo-05.jpg",
        caption: "hehe ❤️"
      },
      {
        src: "assets/images/photo-06.jpg",
        caption: "always us"
      }
    ];
  
  
    /* =======================================================
       GSAP CHECK
    ======================================================= */
  
    const gsapAvailable = typeof gsap !== "undefined";
  
  
    /* =======================================================
       SCENE SYSTEM
       
       IMPORTANT:
       We NEVER replace innerHTML of #app.
       We only toggle scene visibility.
       
       This prevents the white-screen bug.
    ======================================================= */
  
    function showScene(sceneId) {
  
      const nextScene = document.getElementById(sceneId);
  
      if (!nextScene) {
        console.error("Scene not found:", sceneId);
        return;
      }
  
      const oldScene = document.getElementById(currentScene);
  
      if (oldScene === nextScene) {
        return;
      }
  
      if (oldScene) {
        oldScene.classList.remove("active");
        oldScene.classList.add("locked");
      }
  
      nextScene.classList.remove("locked");
      nextScene.classList.add("active");
  
      currentScene = sceneId;
  
      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
  
      animateScene(nextScene);
    }
  
  
    /* =======================================================
       SCENE ANIMATIONS
    ======================================================= */
  
    function animateScene(scene) {
  
      if (!gsapAvailable) {
        return;
      }
  
      const elements = scene.querySelectorAll(
        ".eyebrow, h1, h2, h3, .story-text, .primary-btn, .memory-photo, .reason-card, .letter-paper"
      );
  
      gsap.killTweensOf(elements);
  
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 25
        },
        {
          opacity: 1,
          y: 0,
          duration: .7,
          stagger: .07,
          ease: "power3.out"
        }
      );
    }
  
  
    /* =======================================================
       OPENING ENVELOPE
    ======================================================= */
  
    const envelope = document.getElementById("envelope");
    const openEnvelope = document.getElementById("openEnvelope");
    const startBtn = document.getElementById("startBtn");
  
    let envelopeOpened = false;
  
    function openTheEnvelope() {
  
      if (envelopeOpened) {
        return;
      }
  
      envelopeOpened = true;
  
      envelope.classList.add("open");
  
      if (gsapAvailable) {
  
        gsap.to("#openEnvelope", {
          scale: 0,
          opacity: 0,
          duration: .25
        });
  
        gsap.to(".opening-content > h1", {
          opacity: 0,
          y: 15,
          duration: .3,
          delay: .3
        });
  
        gsap.to(".opening-content > .opening-sub", {
          opacity: 0,
          y: 15,
          duration: .3,
          delay: .35
        });
  
        gsap.to("#startBtn", {
          opacity: 0,
          y: 15,
          duration: .3,
          delay: .4
        });
  
        gsap.delayedCall(1.15, () => {
          showScene("scene-hello");
        });
  
      } else {
  
        setTimeout(() => {
          showScene("scene-hello");
        }, 1000);
  
      }
    }
  
    if (openEnvelope) {
      openEnvelope.addEventListener("click", (event) => {
        event.stopPropagation();
        openTheEnvelope();
      });
    }
  
    if (envelope) {
      envelope.addEventListener("click", openTheEnvelope);
    }
  
    if (startBtn) {
      startBtn.addEventListener("click", openTheEnvelope);
    }
  
  
    /* =======================================================
       NORMAL NEXT BUTTONS
    ======================================================= */
  
    document.querySelectorAll(".next-btn").forEach(button => {
  
      button.addEventListener("click", () => {
  
        const nextScene = button.dataset.next;
  
        if (nextScene) {
          showScene(nextScene);
        }
  
      });
  
    });
  
  
    /* =======================================================
       CONFESSION DATE REVEAL
    ======================================================= */
  
    const dateTrigger = document.getElementById("dateTrigger");
    const confessionText = document.getElementById("confessionText");
    const confessionNext = document.getElementById("confessionNext");
  
    let confessionOpened = false;
  
    if (dateTrigger) {
  
      dateTrigger.addEventListener("click", () => {
  
        if (confessionOpened) {
          return;
        }
  
        confessionOpened = true;
  
        dateTrigger.classList.add("clicked");
  
        confessionText.classList.add("revealed");
  
        setTimeout(() => {
  
          confessionNext.classList.remove("hidden");
  
          if (gsapAvailable) {
  
            gsap.fromTo(
              confessionNext,
              {
                opacity: 0,
                y: 15
              },
              {
                opacity: 1,
                y: 0,
                duration: .5
              }
            );
  
          }
  
        }, 700);
  
        createHeartBurst(
          dateTrigger.getBoundingClientRect().left +
          dateTrigger.offsetWidth / 2,
  
          dateTrigger.getBoundingClientRect().top
        );
  
      });
  
    }
  
  
    /* =======================================================
       PUZZLE
    ======================================================= */
  
    const answers = document.querySelectorAll(".answer");
    const puzzleMessage = document.getElementById("puzzleMessage");
  
    let puzzleSolved = false;
  
    answers.forEach(answer => {
  
      answer.addEventListener("click", () => {
  
        if (puzzleSolved) {
          return;
        }
  
        const correct = answer.dataset.correct === "true";
  
        if (!correct) {
  
          answer.classList.remove("wrong");
  
          // force animation restart
          void answer.offsetWidth;
  
          answer.classList.add("wrong");
  
          puzzleMessage.textContent =
            "Hmmmm... try again pookie 🥺";
  
          return;
        }
  
        puzzleSolved = true;
  
        answer.classList.add("correct");
  
        answers.forEach(button => {
          if (button !== answer) {
            button.disabled = true;
            button.style.opacity = ".35";
          }
        });
  
        puzzleMessage.textContent =
          "YESSS. You actually remember. 🥹❤️";
  
        createHeartBurst(
          window.innerWidth / 2,
          window.innerHeight / 2
        );
  
        setTimeout(() => {
          showScene("scene-memories");
        }, 1300);
  
      });
  
    });
  
  
    /* =======================================================
       MEMORY WALL
    ======================================================= */
  
    const memoryButtons =
      document.querySelectorAll(".memory-photo");
  
    const memoriesNext =
      document.getElementById("memoriesNext");
  
    memoryButtons.forEach(button => {
  
      button.addEventListener("click", () => {
  
        const index = Number(button.dataset.photo) - 1;
  
        memoriesOpened.add(index);
  
        openLightbox(index);
  
        checkMemoryCompletion();
  
      });
  
    });
  
  
    function checkMemoryCompletion() {
  
      if (memoriesOpened.size >= photos.length) {
  
        memoriesNext.classList.remove("hidden");
  
        if (gsapAvailable) {
  
          gsap.fromTo(
            memoriesNext,
            {
              opacity: 0,
              y: 15
            },
            {
              opacity: 1,
              y: 0,
              duration: .5
            }
          );
  
        }
  
      }
  
    }
  
  
    if (memoriesNext) {
  
      memoriesNext.addEventListener("click", () => {
  
        showScene("scene-kiss");
  
      });
  
    }
  
  
    /* =======================================================
       LIGHTBOX
    ======================================================= */
  
    const lightbox =
      document.getElementById("lightbox");
  
    const lightboxImage =
      document.getElementById("lightboxImage");
  
    const lightboxCaption =
      document.getElementById("lightboxCaption");
  
    const lightboxClose =
      document.getElementById("lightboxClose");
  
    const lightboxPrev =
      document.getElementById("lightboxPrev");
  
    const lightboxNext =
      document.getElementById("lightboxNext");
  
  
    function openLightbox(index) {
  
      if (!photos[index]) {
        return;
      }
  
      currentPhoto = index;
  
      updateLightbox();
  
      lightbox.classList.add("open");
  
      document.body.style.overflow = "hidden";
  
      if (gsapAvailable) {
  
        gsap.fromTo(
          ".lightbox-content",
          {
            scale: .9,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: .4,
            ease: "power3.out"
          }
        );
  
      }
  
    }
  
  
    function updateLightbox() {
  
      const photo = photos[currentPhoto];
  
      lightboxImage.src = photo.src;
  
      lightboxCaption.textContent = photo.caption;
  
    }
  
  
    function closeLightbox() {
  
      lightbox.classList.remove("open");
  
      document.body.style.overflow = "";
  
    }
  
  
    function nextPhoto() {
  
      currentPhoto =
        (currentPhoto + 1) % photos.length;
  
      updateLightbox();
  
    }
  
  
    function previousPhoto() {
  
      currentPhoto =
        (currentPhoto - 1 + photos.length) %
        photos.length;
  
      updateLightbox();
  
    }
  
  
    if (lightboxClose) {
      lightboxClose.addEventListener(
        "click",
        closeLightbox
      );
    }
  
    if (lightboxNext) {
      lightboxNext.addEventListener(
        "click",
        nextPhoto
      );
    }
  
    if (lightboxPrev) {
      lightboxPrev.addEventListener(
        "click",
        previousPhoto
      );
    }
  
  
    lightbox.addEventListener("click", event => {
  
      if (event.target === lightbox) {
        closeLightbox();
      }
  
    });
  
  
    /* =======================================================
       KEYBOARD CONTROLS
    ======================================================= */
  
    document.addEventListener("keydown", event => {
  
      if (!lightbox.classList.contains("open")) {
        return;
      }
  
      if (event.key === "Escape") {
        closeLightbox();
      }
  
      if (event.key === "ArrowRight") {
        nextPhoto();
      }
  
      if (event.key === "ArrowLeft") {
        previousPhoto();
      }
  
    });
  
  
    /* =======================================================
       KISS SECTION
    ======================================================= */
  
  
    /* =======================================================
       ARGUMENT — SORRY ENVELOPE
    ======================================================= */
  
    const sorryEnvelope =
      document.getElementById("sorryEnvelope");
  
    const argumentMessage =
      document.getElementById("argumentMessage");
  
    const argumentNext =
      document.getElementById("argumentNext");
  
    let argumentOpened = false;
  
    if (sorryEnvelope) {
  
      sorryEnvelope.addEventListener("click", () => {
  
        if (argumentOpened) {
          return;
        }
  
        argumentOpened = true;
  
        sorryEnvelope.classList.add("open");
  
        setTimeout(() => {
  
          argumentMessage.classList.add("revealed");
  
          setTimeout(() => {
  
            argumentNext.classList.remove("hidden");
  
            if (gsapAvailable) {
  
              gsap.fromTo(
                argumentNext,
                {
                  opacity: 0,
                  y: 15
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: .5
                }
              );
  
            }
  
          }, 500);
  
        }, 500);
  
      });
  
    }
  
  
    if (argumentNext) {
  
      argumentNext.addEventListener("click", () => {
  
        showScene("scene-letter");
  
      });
  
    }
  
  
    /* =======================================================
       LOVE LETTER
    ======================================================= */
  
    const letterPages =
      document.querySelectorAll(".letter-page");
  
    function showLetterPage(pageNumber) {
  
      currentLetterPage = pageNumber;
  
      letterPages.forEach(page => {
  
        const pageNumberValue =
          Number(page.dataset.page);
  
        page.classList.toggle(
          "active",
          pageNumberValue === pageNumber
        );
  
      });
  
      const activePage =
        document.querySelector(
          `.letter-page[data-page="${pageNumber}"]`
        );
  
      if (gsapAvailable && activePage) {
  
        gsap.fromTo(
          activePage,
          {
            opacity: 0,
            x: pageNumber > 1 ? 35 : -35
          },
          {
            opacity: 1,
            x: 0,
            duration: .6,
            ease: "power3.out"
          }
        );
  
      }
  
    }
  
  
    document.querySelectorAll("[data-page-next]")
      .forEach(button => {
  
        button.addEventListener("click", () => {
  
          const page =
            Number(button.dataset.pageNext);
  
          showLetterPage(page);
  
        });
  
      });
  
  
    document.querySelectorAll("[data-page-prev]")
      .forEach(button => {
  
        button.addEventListener("click", () => {
  
          const page =
            Number(button.dataset.pagePrev);
  
          showLetterPage(page);
  
        });
  
      });
  
  
    const letterFinish =
      document.getElementById("letterFinish");
  
    if (letterFinish) {
  
      letterFinish.addEventListener("click", () => {
  
        showScene("scene-reasons");
  
      });
  
    }
  
  
    /* =======================================================
       REASONS
    ======================================================= */
  
    const reasonCards =
      document.querySelectorAll(".reason-card");
  
    const reasonsNext =
      document.getElementById("reasonsNext");
  
    reasonCards.forEach(card => {
  
      card.addEventListener("click", () => {
  
        const reason =
          Number(card.dataset.reason);
  
        if (reasonsOpened.has(reason)) {
          return;
        }
  
        reasonsOpened.add(reason);
  
        card.classList.add("unlocked");
  
        const heart =
          card.querySelector(".locked-heart");
  
        if (heart) {
          heart.textContent = "♥";
        }
  
        createHeartBurst(
          card.getBoundingClientRect().left +
          card.offsetWidth / 2,
  
          card.getBoundingClientRect().top +
          card.offsetHeight / 2
        );
  
        if (reasonsOpened.size === 3) {
  
          reasonsNext.classList.remove("hidden");
  
          if (gsapAvailable) {
  
            gsap.fromTo(
              reasonsNext,
              {
                opacity: 0,
                y: 15
              },
              {
                opacity: 1,
                y: 0,
                duration: .6
              }
            );
  
          }
  
        }
  
      });
  
    });
  
  
    if (reasonsNext) {
  
      reasonsNext.addEventListener("click", () => {
  
        showScene("scene-final");
  
      });
  
    }
  
  
    /* =======================================================
       RESTART
    ======================================================= */
  
    const restartBtn =
      document.getElementById("restartBtn");
  
    if (restartBtn) {
  
      restartBtn.addEventListener("click", () => {
  
        location.reload();
  
      });
  
    }
  
  
    /* =======================================================
       FLOATING HEARTS
    ======================================================= */
  
    function spawnHeart() {
  
      const container =
        document.getElementById("hearts");
  
      if (!container) {
        return;
      }
  
      const heart =
        document.createElement("span");
  
      heart.className = "floating-heart";
  
      heart.textContent =
        Math.random() > .5 ? "♡" : "♥";
  
      heart.style.left =
        Math.random() * 100 + "%";
  
      heart.style.fontSize =
        (12 + Math.random() * 18) + "px";
  
      heart.style.animationDuration =
        (7 + Math.random() * 6) + "s";
  
      heart.style.animationDelay =
        Math.random() * 1 + "s";
  
      container.appendChild(heart);
  
      setTimeout(() => {
        heart.remove();
      }, 15000);
  
    }
  
  
    setInterval(spawnHeart, 900);
  
  
    /* =======================================================
       HEART BURST
    ======================================================= */
  
    function createHeartBurst(x, y) {
  
      const count = 14;
  
      for (let i = 0; i < count; i++) {
  
        const heart =
          document.createElement("div");
  
        heart.textContent =
          i % 2 === 0 ? "♥" : "♡";
  
        heart.style.position = "fixed";
  
        heart.style.left = `${x}px`;
  
        heart.style.top = `${y}px`;
  
        heart.style.zIndex = "999";
  
        heart.style.pointerEvents = "none";
  
        heart.style.color =
          i % 2 === 0 ? "#c85f78" : "#e99aaa";
  
        heart.style.fontSize =
          `${14 + Math.random() * 15}px`;
  
        document.body.appendChild(heart);
  
        const angle =
          Math.random() * Math.PI * 2;
  
        const distance =
          70 + Math.random() * 100;
  
        const targetX =
          Math.cos(angle) * distance;
  
        const targetY =
          Math.sin(angle) * distance;
  
        if (gsapAvailable) {
  
          gsap.to(heart, {
            x: targetX,
            y: targetY,
            opacity: 0,
            scale: .5,
            rotation: Math.random() * 180,
            duration: .8 + Math.random() * .5,
            ease: "power2.out",
            onComplete: () => {
              heart.remove();
            }
          });
  
        } else {
  
          heart.remove();
  
        }
  
      }
  
    }
  
  
    /* =======================================================
       INITIAL ANIMATION
    ======================================================= */
  
    if (gsapAvailable) {
  
      gsap.fromTo(
        ".opening-content > *",
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: .12,
          ease: "power3.out"
        }
      );
  
      gsap.fromTo(
        ".envelope-wrap",
        {
          opacity: 0,
          scale: .8,
          rotation: -4
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.1,
          delay: .3,
          ease: "back.out(1.5)"
        }
      );
  
    }
  
  
    /* =======================================================
       SWIPE SUPPORT FOR LIGHTBOX
    ======================================================= */
  
    let touchStartX = 0;
  
    lightbox.addEventListener("touchstart", event => {
  
      touchStartX =
        event.changedTouches[0].screenX;
  
    }, { passive: true });
  
  
    lightbox.addEventListener("touchend", event => {
  
      const touchEndX =
        event.changedTouches[0].screenX;
  
      const distance =
        touchEndX - touchStartX;
  
      if (Math.abs(distance) < 50) {
        return;
      }
  
      if (distance < 0) {
        nextPhoto();
      } else {
        previousPhoto();
      }
  
    }, { passive: true });
  
  
    /* =======================================================
       IMPORTANT:
       PREVENT SCROLL FROM UNLOCKING ANYTHING
       
       There are NO scroll listeners that change scenes.
       
       The only way to progress is:
         click → interaction → click → puzzle → click
    ======================================================= */
  
  });