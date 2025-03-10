"use client";

const BallotAnimation = () => {
  return (
    <div className="relative w-full max-w-[500px] aspect-square">
      {/* Ballot paper background */}
      <div className="absolute inset-0 bg-white rounded-lg shadow-md p-4">
        <div className="text-xl text-gray-500 mb-6 border-b pb-2 font-bold pl-4">
          OFFICIAL BALLOT
        </div>

        {/* Ballot circle with shading animation */}

        {/* Additional ballot content */}
        <div className="p-6 space-y-2">
          <div className="relative flex items-center gap-3 mb-3">
            <div className="relative h-8 w-8 rounded-full border-2 border-gray-400 overflow-hidden">
              {/* The circle being filled animation */}
              <div className="absolute inset-0 bg-primary shading-animation"></div>
            </div>
            <div className="font-medium">Senate Elections 2025</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-gray-400"></div>
            <div className="h-2 w-60 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-gray-400"></div>
            <div className="h-2 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-gray-400"></div>
            <div className="h-2 w-36 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-gray-400"></div>
            <div className="h-2 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-gray-400"></div>
            <div className="h-2 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-gray-400"></div>
            <div className="h-2 w-36 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shading-animation {
          clip-path: circle(0% at 50% 50%);
          animation: fill-circle 2s ease-in-out infinite;
        }

        .pen-animation {
          top: 35px;
          left: 40px;
          transform-origin: bottom right;
          animation: move-pen 2s ease-in-out infinite;
        }

        @keyframes fill-circle {
          0% {
            clip-path: circle(0% at 50% 50%);
          }
          40% {
            clip-path: circle(100% at 50% 50%);
          }
          100% {
            clip-path: circle(100% at 50% 50%);
          }
        }

        @keyframes move-pen {
          0% {
            transform: translate(-10px, -10px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          40% {
            transform: translate(10px, 10px) rotate(30deg);
          }
          45% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            transform: translate(-10px, -10px) rotate(0deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BallotAnimation;
