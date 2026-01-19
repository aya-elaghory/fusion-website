import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroProps {
  className?: string;
  gradient?: boolean;
  blur?: boolean;
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  videoSrc?: string;
  contentClassName?: string; // Retained to control content padding
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      gradient = true,
      blur = true,
      title,
      subtitle,
      titleClassName,
      subtitleClassName,
      videoSrc = "assets/FusionRX.mp4",
      contentClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative z-0 flex min-h-[80vh] w-full flex-col items-center justify-start overflow-hidden rounded-md bg-background",
          className,
        )}
        {...props}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Optional Gradient Overlay */}
        {gradient && (
          <div className="absolute top-0 isolate z-10 flex w-screen flex-1 items-start justify-center">
            {blur && (
              <div className="absolute top-0 z-50 h-[20vh] w-screen bg-transparent opacity-10 backdrop-blur-md" />
            )}
            <div className="absolute inset-auto z-50 h-[20vh] w-[80vw] max-w-[80rem] -translate-y-[-30%] rounded-full bg-primary/60 opacity-80 blur-3xl" />
            <motion.div
              initial={{ width: "15vw" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "30vw" }}
              className="absolute top-0 z-30 h-[20vh] max-h-[15rem] -translate-y-[-20%] rounded-full bg-primary/60 blur-2xl"
            />
            <motion.div
              initial={{ width: "30vw" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "60vw" }}
              className="absolute inset-auto z-50 h-[0.5vh] max-h-[0.5rem] -translate-y-[-10%] bg-primary/60"
            />
            <motion.div
              initial={{ opacity: 0.5, width: "30vw" }}
              whileInView={{ opacity: 1, width: "60vw" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto right-1/2 h-[30vh] max-h-[20rem] overflow-visible w-[60vw] max-w-[60rem] bg-gradient-conic from-primary/60 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
            >
              <div className="absolute w-[20vw] max-w-[15rem] h-full left-0 bg-transparent bottom-0 z-20 [mask-image:linear-gradient(to_right,black,transparent)]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0.5, width: "30vw" }}
              whileInView={{ opacity: 1, width: "60vw" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto left-1/2 h-[30vh] max-h-[20rem] w-[60vw] max-w-[60rem] bg-gradient-conic from-transparent via-transparent to-primary/60 [--conic-position:from_290deg_at_center_top]"
            >
              <div className="absolute w-[20vw] max-w-[15rem] h-full right-0 bg-transparent bottom-0 z-20 [mask-image:linear-gradient(to_left,black,transparent)]" />
            </motion.div>
          </div>
        )}

        {/* Foreground Content */}
        <motion.div
          initial={{ y: 100, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ y: 0, opacity: 1 }}
          className={cn(
            "relative z-50 container flex justify-center flex-col px-5 md:px-10 gap-6 w-full pt-20 sm:pt-24 md:pt-28",
            contentClassName,
          )}
        >
          <div className="flex flex-col items-center text-center space-y-6">
            {title && (
              <h1
                className={cn(
                  "text-black text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[5vw] xl:text-[4vw] font-bold min-[text-2xl] max-text-[5rem] whitespace-nowrap",
                  titleClassName,
                )}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                className={cn(
                  // Positioning: top-left instead of centered
                  "absolute top-4 left-4 text-black text-[5vw] sm:text-[4.5vw] md:text-[4vw] lg:text-[3vw] xl:text-[2vw] font-bold min-[text-xl] max-text-[3.5rem] whitespace-nowrap",
                  // Add animation class
                  "animate-slide-up",
                  subtitleClassName
                )}
              >
                {subtitle}
              </p>
            )}
            {/* Removed actions/buttons logic */}
          </div>
        </motion.div>
      </section>
    );
  },
);

Hero.displayName = "Hero";

export default Hero;