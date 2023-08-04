import type { MediaConnection, Peer } from "peerjs";
import { createRef, useEffect, useState } from "react";

// const Button = dynamic(()=>import('./Btn'), {
//   loading: ()=> <p>Loading</p>
// })
export default function Page() {
  //const res = await(await fetch(new URL('/peer/peerjs/id',Global.DOMAIN))).text()
  const [remoteID, setRemoteID] = useState("");
  const [localID, setLocalID] = useState("");
  const localMedia = createRef<HTMLVideoElement>();
  const remoteMedia = createRef<HTMLVideoElement>();

  const [remoteConn, setRemoteConn] = useState<MediaConnection>();
  const [peer, setPeer] = useState<Peer>();
  useEffect(() => {
    // fetch(new URL("/peer/peerjs/id", Global.DOMAIN)).then(async (res) => {
    //   const id = await res.text();
    //   setLocalID(id);
    import("peerjs").then(async ({ Peer }) => {
      let newpeer = new Peer();

      newpeer.on("open", (id) => {
        setLocalID(id);
        console.log(`connect server id: ${id}`);
      });
      newpeer.on("call", (mediaConn) => {
        setRemoteID(mediaConn.peer);
        console.log(`call from`, mediaConn);

        setRemoteConn(mediaConn);
      });

      setPeer(newpeer);
    });
    // });
  }, []);

  return (
    <div className=" grid grid-cols-2">
      <div className=" flex flex-col">
        <p className="text-green-500">{localID}</p>
        <video
          className="border border-green-400"
          autoPlay
          playsInline
          muted
          id="local-media"
          width={1000}
          height={500}
          ref={localMedia}
        ></video>
      </div>
      <div className="flex flex-col">
        <input
          type="text"
          className="border border-blue-500"
          onChange={(e) => setRemoteID(e.currentTarget.value)}
        />
        <video
          className="border border-green-400"
          autoPlay
          playsInline
          muted
          id="remote-media"
          width={1000}
          height={500}
          ref={remoteMedia}
        ></video>
      </div>
      <div className="w-full flex justify-around">
        {remoteConn && (
          <button
            className="px-3 py-2 w-24 shadow bg-slate-300"
            onClick={() => {
              navigator.mediaDevices
                .getDisplayMedia({
                  video: true,
                })
                .then((localStream) => {
                  console.log(`send stream`);
                  remoteConn!.answer(localStream);
                  (
                    window.document.getElementById(
                      "local-media"
                    )! as HTMLVideoElement
                  ).srcObject = localStream;
                });
              remoteConn!.on("stream", (stream) => {
                (
                  window.document.getElementById(
                    "remote-media"
                  )! as HTMLVideoElement
                ).srcObject = stream;
              });
            }}
          >
            确认连接：{remoteID}
          </button>
        )}

        <button
          className="px-3 py-2 w-24 shadow bg-slate-300"
          onClick={() => {
            navigator.mediaDevices
              .getDisplayMedia({
                video: true,
              })
              .then((localStream) => {
                const conn = peer!.call(remoteID, localStream);
                conn.on("stream", (remoteStream) => {
                  console.log(`remote conn is connected!!!`);
                  (
                    window.document.getElementById(
                      "remote-media"
                    )! as HTMLVideoElement
                  ).srcObject = remoteStream;
                });
                (
                  window.document.getElementById(
                    "local-media"
                  )! as HTMLVideoElement
                ).srcObject = localStream;
              });
          }}
        >
          连接
        </button>
      </div>
    </div>
  );
}