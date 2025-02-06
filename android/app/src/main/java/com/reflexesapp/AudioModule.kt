package com.reflexesapp

import android.media.MediaPlayer
import android.media.MediaRecorder
import android.media.MediaMetadataRetriever
import android.media.PlaybackParams
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.*
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.IOException

class AudioModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var mediaPlayer: MediaPlayer? = null
    private var currentPosition: Int = 0
    private var playbackSpeed: Float = 1.0f
    private var recorder: MediaRecorder? = null
    private var outputFilePath: String? = null

    override fun getName(): String {
        return "AudioModule"
    }

    @ReactMethod
    fun playAudio(fileName: String, desiredDurationMs: Double, promise: Promise) {
        mediaPlayer?.release()
        mediaPlayer = MediaPlayer()

        val context = reactApplicationContext
        val assetFileDescriptor = context.assets.openFd("punchs/$fileName")

        try {
            mediaPlayer?.setDataSource(assetFileDescriptor.fileDescriptor, assetFileDescriptor.startOffset, assetFileDescriptor.length)
            mediaPlayer?.prepare()

            val originalDurationMs = mediaPlayer?.duration?.toLong() ?: 0
            val speed = originalDurationMs.toFloat() / desiredDurationMs.toFloat()

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                mediaPlayer?.playbackParams = PlaybackParams().apply {
                    setSpeed(speed)
                }
            }

            mediaPlayer?.setOnCompletionListener {
                it.release()
                mediaPlayer = null
                promise.resolve(null)
            }

            mediaPlayer?.start()
            
        } catch (e: IOException) {
            promise.reject("Audio Load Error", e)
        }
    }

    @ReactMethod
    fun reanudarAudio(fileName: String, desiredDurationMs: Double, skipToMs: Double, promise: Promise) {
        mediaPlayer?.release()
        mediaPlayer = MediaPlayer()

        val context = reactApplicationContext
        val assetFileDescriptor = context.assets.openFd("punchs/$fileName")

        try {
            mediaPlayer?.setDataSource(assetFileDescriptor.fileDescriptor, assetFileDescriptor.startOffset, assetFileDescriptor.length)
            mediaPlayer?.prepare()

            val originalDurationMs = mediaPlayer?.duration?.toLong() ?: 0
            val speed = originalDurationMs.toFloat() / desiredDurationMs.toFloat()

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                mediaPlayer?.playbackParams = PlaybackParams().apply {
                    setSpeed(speed)
                }
            }

            if (skipToMs in 0.0..originalDurationMs.toDouble()) {
                mediaPlayer?.seekTo(skipToMs.toInt())
            }


            mediaPlayer?.setOnCompletionListener {
                it.release()
                mediaPlayer = null
                promise.resolve(null)
            }

            mediaPlayer?.start()
            
        } catch (e: IOException) {
            promise.reject("Audio Load Error", e)
        }
    }


    @ReactMethod
    fun playAudio1(filePath: String, desiredDurationMs: Double, promise: Promise) {

        mediaPlayer?.release()
        mediaPlayer = MediaPlayer()

        val context = reactApplicationContext

        try {
            val file = File(filePath)

            if (!file.exists()) {
                promise.reject("FILE_NOT_FOUND", "El archivo de audio no se encuentra en la ruta: $filePath")
                return
            }

            mediaPlayer?.setDataSource(file.absolutePath)
            mediaPlayer?.prepare()

            val originalDurationMs = mediaPlayer?.duration?.toLong() ?: 0
            val speed = originalDurationMs.toFloat() / desiredDurationMs.toFloat()

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                mediaPlayer?.playbackParams = PlaybackParams().apply {
                    setSpeed(speed)
                }
            }

            mediaPlayer?.setOnCompletionListener {
                it.release()
                mediaPlayer = null
                promise.resolve(null)
            }

            mediaPlayer?.start()
        } catch (e: IOException) {
            promise.reject("Audio Load Error", e)
        }
    }

        @ReactMethod
    fun reanudarAudio1(filePath: String, desiredDurationMs: Double, skipToMs: Double, promise: Promise) {
        
        mediaPlayer?.release()
        mediaPlayer = MediaPlayer()

        val context = reactApplicationContext

        try {
            val file = File(filePath)
    
            if (!file.exists()) {
                promise.reject("FILE_NOT_FOUND", "El archivo de audio no se encuentra en la ruta: $filePath")
                return
            }

            mediaPlayer?.setDataSource(file.absolutePath)
            mediaPlayer?.prepare()

            val originalDurationMs = mediaPlayer?.duration?.toLong() ?: 0
            val speed = originalDurationMs.toFloat() / desiredDurationMs.toFloat()

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                mediaPlayer?.playbackParams = PlaybackParams().apply {
                    setSpeed(speed)
                }
            }

            if (skipToMs in 0.0..originalDurationMs.toDouble()) {
                mediaPlayer?.seekTo(skipToMs.toInt())
            }

            mediaPlayer?.setOnCompletionListener {
                it.release()
                mediaPlayer = null
                promise.resolve(null)
            }

            mediaPlayer?.start()
        } catch (e: IOException) {
            promise.reject("Audio Load Error", e)
        }
    }

    @ReactMethod
    fun pauseAudio(promise: Promise) {
    try {
        if (mediaPlayer != null) {
            if (mediaPlayer!!.isPlaying) {
                // Pausar el audio
                mediaPlayer!!.pause()
                
                // Obtener la posición actual en milisegundos
                val pausedPosition = mediaPlayer!!.currentPosition
                promise.resolve(pausedPosition.toDouble()) // Devolver la posición como Double
            } else {
                // El audio ya fue completado o no se está reproduciendo nada
                promise.resolve(null) // Devolver null si no hay nada que pausar
            }
        } else {
            promise.resolve(null) // Devolver null si no hay MediaPlayer
        }
    } catch (e: Exception) {
        promise.reject("Pause Error", e)
    }
    }

    @ReactMethod
   fun resumeAudio(promise: Promise) {
        mediaPlayer?.apply {
            if (!isPlaying) {
                setOnCompletionListener {
                    it.release()
                    mediaPlayer = null
                    promise.resolve(null) // Resolve the promise when audio completes
                }
                start()
            }
        } ?: promise.reject("No audio loaded", "No audio is loaded to resume")
    }

    @ReactMethod
    fun stopAudio(promise: Promise) {
        mediaPlayer?.let {
            it.stop()
            it.release()
            mediaPlayer = null
            currentPosition = 0
            promise.resolve(null)
        } ?: promise.reject("Audio Stop Error", "Audio not loaded")
    }

    @ReactMethod
    fun startRecording(promise: Promise) {
        // Establece el archivo de salida
        val outputDir = reactApplicationContext.cacheDir // Usando el directorio de caché para almacenar temporalmente el archivo
        val outputFile = File.createTempFile("audio_", ".m4a", outputDir)
        outputFilePath = outputFile.absolutePath

        recorder = MediaRecorder().apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            setOutputFile(outputFilePath)
            
            try {
                prepare()
                start()
                promise.resolve("Recording started")
            } catch (e: IOException) {
                promise.reject("START_FAILED", "Failed to start recording", e)
            }
        }
    }

    @ReactMethod
    fun stopRecording(promise: Promise) {
        try {
            recorder?.apply {
                stop()
                release()
            }
            recorder = null

            if (outputFilePath != null) {
                // Usar MediaMetadataRetriever para obtener la duración del archivo
                val retriever = MediaMetadataRetriever()
                retriever.setDataSource(outputFilePath)
                val durationStr = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)
                val duration = durationStr?.toLongOrNull() ?: 0L // Duración en milisegundos
                retriever.release()

                val result = Arguments.createMap().apply {
                    putString("filePath", outputFilePath)
                    putDouble("duration", duration.toDouble())
                }
                promise.resolve(result)
            } else {
                promise.reject("STOP_FAILED", "Failed to stop recording or file path is null")
            }

        } catch (e: RuntimeException) {
            promise.reject("STOP_FAILED", "Failed to stop recording", e)
        }
    }
@ReactMethod
fun getAudioDuration(filePath: String, promise: Promise) {
    // Liberar cualquier recurso de MediaPlayer previo
    mediaPlayer?.release()
    mediaPlayer = MediaPlayer()

    val context = reactApplicationContext

    try {
        val file = File(filePath)

        // Verificar si el archivo existe
        if (!file.exists()) {
            promise.reject("FILE_NOT_FOUND", "El archivo de audio no se encuentra en la ruta: $filePath")
            return
        }

        // Configurar MediaPlayer
        mediaPlayer?.setDataSource(file.absolutePath)
        mediaPlayer?.prepare()

        val originalDurationMs = mediaPlayer?.duration?.toLong() ?: 0

        // Convertir Long a Double para asegurarse de que es compatible con React Native
        promise.resolve(originalDurationMs.toDouble())
    } catch (e: IOException) {
        promise.reject("Audio Load Error", e)
    }
}
}
