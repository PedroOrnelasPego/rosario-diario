package com.rosariodiario.app;

import android.Manifest;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.JavascriptInterface;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.Calendar;

public class MainActivity extends BridgeActivity {
    private Ringtone currentPreview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Adiciona a interface para o JavaScript
        getBridge().getWebView().addJavascriptInterface(new WebAppInterface(this), "NativeApp");

        // Pedir permissões de forma explícita e forçada
        requestAppPermissions();
    }

    private void requestAppPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                
                ActivityCompat.requestPermissions(this, new String[]{
                    Manifest.permission.CAMERA,
                    Manifest.permission.POST_NOTIFICATIONS
                }, 101);
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{
                    Manifest.permission.CAMERA
                }, 101);
            }
        }
    }

    public class WebAppInterface {
        Context mContext;
        WebAppInterface(Context c) { mContext = c; }

        @JavascriptInterface
        public String getSystemRingtones() {
            org.json.JSONArray array = new org.json.JSONArray();
            android.media.RingtoneManager rm = new android.media.RingtoneManager(mContext);
            rm.setType(android.media.RingtoneManager.TYPE_ALARM);
            android.database.Cursor cursor = rm.getCursor();
            if (cursor != null) {
                int count = 0;
                while (cursor.moveToNext() && count < 4) {
                    try {
                        org.json.JSONObject obj = new org.json.JSONObject();
                        String title = cursor.getString(android.media.RingtoneManager.TITLE_COLUMN_INDEX);
                        String uri = cursor.getString(android.media.RingtoneManager.URI_COLUMN_INDEX) + "/" + cursor.getString(android.media.RingtoneManager.ID_COLUMN_INDEX);
                        obj.put("name", title);
                        obj.put("url", uri);
                        array.put(obj);
                        count++;
                    } catch(Exception e) {}
                }
                cursor.close();
            }
            return array.toString();
        }

        @JavascriptInterface
        public void playRingtonePreview(String soundUri) {
            stopRingtonePreview();
            Uri notification = soundUri != null && !soundUri.isEmpty() ? Uri.parse(soundUri) : RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            currentPreview = RingtoneManager.getRingtone(mContext, notification);
            if (currentPreview != null) {
                currentPreview.play();
            }
        }

        @JavascriptInterface
        public void stopRingtonePreview() {
            if (currentPreview != null && currentPreview.isPlaying()) {
                currentPreview.stop();
            }
        }

        @JavascriptInterface
        public void setAlarm(int id, int hour, int minute, String soundUri) {
            if (id < 0 || id > 2) return;
            Intent intent = new Intent(mContext, AlarmReceiver.class);
            intent.putExtra("soundUri", soundUri);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(mContext, id, intent, 
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

            AlarmManager alarmManager = (AlarmManager) mContext.getSystemService(Context.ALARM_SERVICE);
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, hour);
            calendar.set(Calendar.MINUTE, minute);
            calendar.set(Calendar.SECOND, 0);

            if (calendar.getTimeInMillis() <= System.currentTimeMillis()) {
                calendar.add(Calendar.DAY_OF_MONTH, 1);
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
                } else {
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
                }
            } else {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
            }
        }

        @JavascriptInterface
        public void cancelAlarm(int id) {
            if (id < 0 || id > 2) return;
            Intent intent = new Intent(mContext, AlarmReceiver.class);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(mContext, id, intent, 
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            AlarmManager alarmManager = (AlarmManager) mContext.getSystemService(Context.ALARM_SERVICE);
            alarmManager.cancel(pendingIntent);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN || keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
            this.getBridge().triggerWindowJSEvent("volumeButtonPressed");
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
