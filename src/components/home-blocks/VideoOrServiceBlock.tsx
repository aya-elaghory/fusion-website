import React from "react";

const VideoOrServiceBlock = ({
  playVideo,
  selectedService,
  handleVideoPlay,
  handleVideoEnd,
  videoRef,
  concernImages,
  handleServiceClick,
  handleBackClick,
  mobile = false,
}: any) => {
  return (
    <div
      className={`w-full ${mobile ? "h-64" : "h-[322px]"} bg-primary relative overflow-hidden`}
    >
      {!playVideo && !selectedService && (
        <img
          src="/assets/Fusion_lab.jpg"
          alt="Video Poster"
          className="w-full h-full object-cover cursor-pointer"
          loading="lazy"
          onClick={handleVideoPlay}
        />
      )}
      {playVideo && !selectedService && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted={mobile}
          onEnded={handleVideoEnd}
        >
          <source src="/assets/Fusion_Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {selectedService && (
        <div
          className="w-full h-full relative overflow-y-auto p-4"
          style={{
            backgroundImage: `url(${selectedService.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-invert flex flex-col items-center justify-start">
            <h3 className={`font-semibold text-center w-full mb-4 ${mobile ? "text-lg" : "text-2xl mb-6"}`}>
              {selectedService.name}
            </h3>
            <div className={`${mobile ? "grid grid-cols-4" : "grid grid-cols-5"} gap-0.5 w-full`}>
              {(selectedService.name === "Dermatology" &&
              selectedService.subcategories
                ? selectedService.subcategories
                    .flatMap((subcategory: any) => subcategory.services)
                : selectedService.services || []
              ).map((service: string, i: number) => (
                <button
                  key={i}
                  className="flex flex-col items-center hover:opacity-80 transition-opacity"
                  onClick={() => handleServiceClick(selectedService.name, service)}
                >
                  <img
                    src={concernImages[service]}
                    alt={service}
                    className={mobile ? "w-12 h-12 mb-1" : "w-16 h-16 mb-2"}
                    loading="lazy"
                  />
                  <span className="text-xs text-center">{service}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center z-20">
            <button
              className="bg-green-800 bg-opacity-40 text-white px-2 py-0 hover:bg-green-900 transition-colors"
              onClick={handleBackClick}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoOrServiceBlock;
