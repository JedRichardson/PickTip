# ProGuard rules for PickTip

# Room
-keep class com.picktip.data.local.** { *; }

# Moshi
-keep class com.picktip.data.models.** { *; }
-keep @com.squareup.moshi.JsonClass class *
-keepclassmembers class * {
    @com.squareup.moshi.Json *;
}

# Retrofit
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepattributes AnnotationDefault
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keep @retrofit2.http.** interface * { *; }
