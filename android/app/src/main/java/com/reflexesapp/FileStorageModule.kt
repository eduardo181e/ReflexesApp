package com.reflexesapp

import android.util.Log
import android.content.Context
import android.os.Environment
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileOutputStream
import java.io.OutputStreamWriter
import java.io.IOException
import java.io.BufferedReader
import java.io.FileReader
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray

class FileStorageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context: Context = reactContext.applicationContext

    override fun getName(): String {
        return "FileStorageModule"
    }

    @ReactMethod
    fun getDocumentDirectoryPath(promise: Promise) {
        try {
            val documentDirectory: File? = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS)
            if (documentDirectory != null) {
                promise.resolve(documentDirectory.absolutePath)
            } else {
                promise.reject("Error", "No se pudo obtener el directorio de documentos.")
            }
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }

    @ReactMethod
    fun fileExists(filePath: String, promise: Promise) {
        try {
            val file = File(filePath)
            if (file.exists()) {
                promise.resolve(true)
            } else {
                promise.resolve(false)
            }
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }

    @ReactMethod
    fun createDirectory(dirPath: String, promise: Promise) {
        try {
            val dir = File(dirPath)
            if (!dir.exists()) {
                val success = dir.mkdirs()
                if (success) {
                    promise.resolve("Directorio creado exitosamente.")
                } else {
                    promise.reject("Error", "No se pudo crear el directorio.")
                }
            } else {
                promise.resolve("El directorio ya existe.")
            }
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }

    @ReactMethod
    fun writeFile(filePath: String, content: String, promise: Promise) {
        try {
            val file = File(filePath)
            val fos = FileOutputStream(file)
            val writer = OutputStreamWriter(fos, "UTF-8")

            writer.write(content)
            writer.flush()
            writer.close()
            fos.close()

            promise.resolve("Archivo guardado exitosamente.")
        } catch (e: IOException) {
            promise.reject("Error", e)
        }
    }
    @ReactMethod
    fun readFile(filePath: String, promise: Promise) {
        try {
            val file = File(filePath)
            if (file.exists()) {
                val reader = BufferedReader(FileReader(file))
                val content = StringBuilder()
                var line: String?

                while (reader.readLine().also { line = it } != null) {
                    content.append(line).append("\n")
                }

                reader.close()
                promise.resolve(content.toString().trim())
            } else {
                promise.reject("Error", "El archivo no existe.")
            }
        } catch (e: IOException) {
            promise.reject("Error", e)
        }
    }
    @ReactMethod
    fun readDirectory(dirPath: String, promise: Promise) {
        try {
            val directory = File(dirPath)
            if (directory.exists() && directory.isDirectory) {
                val files = directory.listFiles()
                if (files != null) {
                    val fileNames = Arguments.createArray()
                    for (file in files) {
                        fileNames.pushString(file.name)
                    }
                    promise.resolve(fileNames)
                } else {
                    promise.reject("Error", "No se pudieron listar los archivos en el directorio.")
                }
            } else {
                promise.reject("Error", "El directorio no existe o no es un directorio.")
            }
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }
    @ReactMethod
    fun deleteFile(filePath: String, promise: Promise) {
        try {
            val file = File(filePath)
            if (file.exists()) {
                val deleted = file.delete()
                if (deleted) {
                    promise.resolve("Archivo eliminado exitosamente.")
                } else {
                    promise.reject("Error", "No se pudo eliminar el archivo.")
                }
            } else {
                promise.reject("Error", "El archivo no existe.")
            }
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }

@ReactMethod
fun moveFile(sourcePath: String, destinationDir: String, promise: Promise) {
    try {
        val sourceFile = File(sourcePath)
        val destinationDirFile = File(destinationDir)

        // Verificar si el archivo de origen existe
        if (!sourceFile.exists()) {
            promise.reject("FILE_NOT_FOUND", "El archivo de origen no existe en la ruta: $sourcePath")
            return
        }

        // Crear el directorio de destino si no existe
        if (!destinationDirFile.exists()) {
            destinationDirFile.mkdirs()
        }

        // Crear el archivo de destino con el mismo nombre que el archivo de origen
        val destinationFile = File(destinationDirFile, sourceFile.name)

        // Mover el archivo al destino (copiar y luego eliminar el archivo original)
        val success = sourceFile.copyTo(destinationFile, overwrite = true) != null

        if (success) {
            // Eliminar el archivo original si la copia fue exitosa
            if (sourceFile.delete()) {
                promise.resolve(destinationFile.absolutePath)
            } else {
                promise.reject("DELETE_FAILED", "No se pudo eliminar el archivo original en la ruta: $sourcePath")
            }
        } else {
            promise.reject("MOVE_FAILED", "No se pudo mover el archivo a: ${destinationFile.absolutePath}")
        }

    } catch (e: IOException) {
        promise.reject("ERROR", "Ocurrió un error al mover el archivo", e)
    }
}


    @ReactMethod
    fun renameFile(oldFilePath: String, newFileName: String, promise: Promise) {
        try {
            val oldFile = File(oldFilePath)
            
            // Verificar si el archivo de origen existe
            if (!oldFile.exists()) {
                promise.reject("FILE_NOT_FOUND", "El archivo no existe en la ruta: $oldFilePath")
                return
            }

            // Crear el archivo de destino con el nuevo nombre en la misma ruta
            val newFile = File(oldFile.parentFile, newFileName)

            // Renombrar el archivo
            val success = oldFile.renameTo(newFile)

            if (success) {
                promise.resolve(newFile.absolutePath)
            } else {
                promise.reject("RENAME_FAILED", "No se pudo renombrar el archivo a: ${newFile.absolutePath}")
            }

        } catch (e: IOException) {
            promise.reject("ERROR", "Ocurrió un error al renombrar el archivo", e)
        }
    }

    @ReactMethod
    fun deleteDirectory(directoryPath: String, promise: Promise) {
        try {
            val directory = File(directoryPath)

            if (!directory.exists()) {
                promise.reject("DIRECTORY_NOT_FOUND", "El directorio no existe en la ruta: $directoryPath")
                return
            }

            if (!directory.isDirectory) {
                promise.reject("INVALID_PATH", "La ruta proporcionada no es un directorio: $directoryPath")
                return
            }

            deleteRecursively(directory)

            promise.resolve("Directorio y su contenido eliminado exitosamente.")
        } catch (e: Exception) {
            promise.reject("ERROR", "Ocurrió un error al eliminar el directorio", e)
        }
    }

    private fun deleteRecursively(file: File): Boolean {
        if (file.isDirectory) {
            val children = file.listFiles() ?: return false
            for (child in children) {
                if (!deleteRecursively(child)) {
                    return false
                }
            }
        }
        return file.delete()
    }

    @ReactMethod
    fun copyFileOrDirectory(sourcePath: String, destinationDir: String, newName: String, promise: Promise) {
        try {
            val sourceFile = File(sourcePath)
            val destinationFile = File(destinationDir, newName)

            if (!sourceFile.exists()) {
                promise.reject("FILE_NOT_FOUND", "El archivo o directorio de origen no existe en la ruta: $sourcePath")
                return
            }

            if (sourceFile.isDirectory) {
                copyDirectory(sourceFile, destinationFile)
            } else {
                copyFile(sourceFile, destinationFile)
            }

            promise.resolve("Archivo o directorio copiado exitosamente a: ${destinationFile.absolutePath}")
        } catch (e: IOException) {
            promise.reject("COPY_FAILED", "Error al copiar el archivo o directorio", e)
        }
    }

    private fun copyFile(sourceFile: File, destinationFile: File) {
        sourceFile.inputStream().use { input ->
            destinationFile.outputStream().use { output ->
                input.copyTo(output)
            }
        }
    }

    private fun copyDirectory(sourceDir: File, destinationDir: File) {
        if (!destinationDir.exists()) {
            destinationDir.mkdirs()
        }
        sourceDir.listFiles()?.forEach { file ->
            val destinationFile = File(destinationDir, file.name)
            if (file.isDirectory) {
                copyDirectory(file, destinationFile)
            } else {
                copyFile(file, destinationFile)
            }
        }
    }
}
