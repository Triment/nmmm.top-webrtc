import Peer, { MediaConnection } from "peerjs";
import { useCallback, useEffect, useState } from "react";
import RemoteVideo from "../components/RemoteVideo";

export default function WellCome() {
  const [remoteMediaStream, setRemoteStream] = useState<MediaStream>();
  const [remoteID, setRemoteID] = useState("");
  const [localID, setLocalID] = useState("");
  const [remoteConn, setRemoteConn] = useState<MediaConnection>();
  const [peer, setPeer] = useState<Peer>();

  const createPeerConnection = useCallback(() => {
    let newpeer = new Peer({
      host: "nmmm.top",
      secure: true,
    });

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
  }, []);
  useEffect(() => {
    // import("peerjs").then(async ({ Peer }) => {
    if (!peer) createPeerConnection();
    // });
  }, [createPeerConnection]);

  function acceptRemoteCall() {
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
      })
      .then((localStream) => {
        console.log(`answer stream to remote`);
        remoteConn!.answer(localStream);
      });
    remoteConn!.on("stream", (stream) => {
      console.log(stream.getTracks());
    });
  }

  function rejectRemoteCall() {
    remoteConn?.close();
  }

  function callRemote() {
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
      })
      .then((localStream) => {
        const conn = peer!.call(remoteID, localStream);
        conn.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
        });
      });
  }

  return (
    <div className="h-full w-full flex flex-col bg-amber-200 items-center justify-center">
      <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 p-3">
        <div>
          <span className="font-bold text-green-500">本机识别码:</span>
          <p className="text-orange-500 inline-block">{localID}</p>
        </div>
        <div className="w-full flex flex-row items-center">
          <span className="font-bold text-center text-green-500">
            输入对方识别码:
          </span>
          <input
            type="text"
            onChange={(e) => setRemoteID(e.currentTarget.value)}
            className="mx-2 text-orange-500 my-2 inline-block flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 focus:border-amber-200 focus:ring-pink-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400  sm:text-sm"
          />
        </div>
        <button
          onClick={callRemote}
          className="w-full rounded-lg bg-green-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:border-green-300 hover:bg-green-500 focus:ring-2 focus:ring-green-300"
        >
          连接
        </button>
      </div>
      {remoteConn && (
        <div>
          {" "}
          <h3>提醒</h3> <p>你有一个来自{remoteConn.peer}的连接请求是否确认？</p>
          <button onClick={acceptRemoteCall}>是</button>
          <button onClick={rejectRemoteCall}>否</button>
        </div>
      )}
      <RemoteVideo stream={remoteMediaStream} />
      <button onClick={()=>{
        navigator.mediaDevices
        .getDisplayMedia({
          video: true,
        })
        confirm("heoo")
      }}>test</button>
    </div>
  );
}
