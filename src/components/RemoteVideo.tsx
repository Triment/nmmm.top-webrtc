import { createRef, useEffect } from "react";

type RemoteVideoPropsType = {
  stream?: MediaStream;
};

export default function RemoteVideo({ stream }: RemoteVideoPropsType) {
  const ref = createRef<HTMLVideoElement>();
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [ref, stream]);
  return (
    <div
      className={`${
        stream ? "absolute top-0 w-full h-full" : "hidden"
      }  border border-green-500`}
    >
      <video ref={ref} autoPlay playsInline muted></video>
    </div>
  );
}
