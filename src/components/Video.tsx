import React, {ChangeEvent, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType} from "../redux/store";
import './Video.css'
import {formatTime} from "../utils/utils";

export function Video() {
    const source = useSelector<AppRootStateType, string>(state => state.app.data[0].url)
    const poster = useSelector<AppRootStateType, string>(state => state.app.data[1].url)
    const media = useRef<HTMLVideoElement>(null!)
    const player = useRef<HTMLDivElement>(null!)
    const volumeInput = useRef<HTMLInputElement>(null!)

    const [currentVideoTime, setCurrentVideoTime] = useState({minutes: '00', seconds: '00'})
    const [duration, setDuration] = useState({minutes: '00', seconds: '00'})
    const [slider, setSlider] = useState(0)
    const [progress, setProgress] = useState(0)
    const [progressDuration, setProgressDuration] = useState(0)
    const [paused, setPaused] = useState(true)
    const [volume, setVolume] = useState(1)
    const [muted, setMuted] = useState(false)

    const playPause = () => {
        if (media.current.paused || media.current.ended) {
            media.current.play()
        } else {
            media.current.pause()
        }
    }

    const stopVideo = () => {
        media.current.pause()
        media.current.currentTime = 0
        setPaused(true)
    }

    const onTimeUpdate = () => {
        const time = formatTime(Math.round(media.current.currentTime))
        setCurrentVideoTime(time)
        setSlider(media.current.currentTime)
        setProgress(media.current.currentTime)
    }

    const setVideo = () => {
        const time = formatTime(Math.round(media.current.duration))
        setProgressDuration(Math.round(media.current.duration))
        setDuration(time)
        setPaused(media.current.paused)
        setVolume(media.current.volume)
        setMuted(media.current.muted)
    }

    const onChangeSlider = (e: ChangeEvent<HTMLInputElement>) => {
        media.current.currentTime = e.currentTarget.valueAsNumber
        setSlider(e.currentTarget.valueAsNumber)
    }

    const onSliderMouseDown = () => {
        media.current.pause()
    }

    const onSliderMouseUp = () => {
        media.current.play()
    }

    const onChangeVolume = (e: ChangeEvent<HTMLInputElement>) => {
        if (media.current.muted) {
            media.current.muted = false
            setMuted(false)
        }
        media.current.volume = e.currentTarget.valueAsNumber
        setVolume(media.current.volume)

    }

    const toggleMute = () => {
        media.current.muted = !media.current.muted
        setMuted(!muted)
    }

    const toggleFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            player.current.requestFullscreen()
        }
    }

    const onVolumeMouseOver = () => {
        volumeInput.current.style.display = 'block'
    }

    const onVolumeMouseOut = () => {
        volumeInput.current.style.display = 'none'
    }

    const controllersClassName = document.fullscreenElement ? `video-controls fsmode` : `video-controls`

    const volumeIcon = () => {
        if (volume === 0 || muted) {
            return <svg id="volume-mute" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.203-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q1.031 0.516 1.758 1.688t0.727 2.344z"/>
            </svg>
        } else if (volume < 0.5) {
            return <svg id="volume-low" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M5.016 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6zM18.516 12q0 2.766-2.531 4.031v-8.063q1.031 0.516 1.781 1.711t0.75 2.32z"/>
            </svg>
        } else {
            return <svg id="volume-high" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"/>
            </svg>
        }
    }

    return (
        <div className={'player'} ref={player}>
            <video className={'video'} ref={media} src={source} poster={poster} onTimeUpdate={onTimeUpdate}
                   onLoadedMetadata={setVideo} onClick={playPause} onPause={() => {setPaused(true)}} onPlay={() => setPaused(false)} onVolumeChange={(e) => setVolume(e.currentTarget.volume)}>
                Your browser doesn't support HTML5 video.
            </video>
            <div className={controllersClassName}>
                <div className="video-progress">
                    <progress id="progress-bar" value={progress} max={progressDuration}></progress>
                    <input className="seek" id="seek" value={slider} min="0" type="range" step="1"
                           max={progressDuration} onChange={onChangeSlider} onMouseUp={onSliderMouseUp}
                           onMouseDown={onSliderMouseDown}/>
                </div>
                <div className={'bottom-video-controls'}>
                    <div className={'video-controls-left'}>
                        <button className={'play-pause'} onClick={playPause}>
                            {paused
                                ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M3 22v-20l18 10-18 10z"/>
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z"/>
                                </svg>
                            }
                        </button>
                        <button className={'stop'} onClick={stopVideo}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M2 2h20v20h-20z"/>
                            </svg>
                        </button>
                        <div className={'time'}>
                            <time>{`${currentVideoTime.minutes}:${currentVideoTime.seconds} / ${duration.minutes}:${duration.seconds}`}</time>
                        </div>
                    </div>
                    <div className={'video-controls-right'} onMouseOver={onVolumeMouseOver} onMouseOut={onVolumeMouseOut}>
                        <div className="volume-controls">
                            <button data-title="Mute (m)" className="volume-button" id="volume-button"
                                    onClick={toggleMute} >
                                {volumeIcon()}
                            </button>
                            <input ref={volumeInput} className="volume" id="volume" type="range" value={volume} max="1" min="0"
                                   step="0.01" onChange={onChangeVolume}/>
                        </div>
                        <button className={'full-screen'} onClick={toggleFullScreen}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path
                                    d="M24 9h-4v-5h-5v-4h9v9zm-9 15v-4h5v-5h4v9h-9zm-15-9h4v5h5v4h-9v-9zm9-15v4h-5v5h-4v-9h9z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}