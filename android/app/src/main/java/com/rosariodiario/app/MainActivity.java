package com.rosariodiario.app;

import android.Manifest;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Pedir permissões logo no início (Android 13+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissions(new String[]{
                Manifest.permission.CAMERA,
                Manifest.permission.POST_NOTIFICATIONS
            }, 101);
        } else {
            requestPermissions(new String[]{
                Manifest.permission.CAMERA
            }, 101);
        }
    }

    // Usar botões de volume para "disparar" algo no app (como a câmera)
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN || keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
            // Aqui você pode disparar um evento para o seu código JS
            // Corrigido: O método correto no Capacitor é triggerWindowJSEvent (JS em maiúsculo)
            this.getBridge().triggerWindowJSEvent("volumeButtonPressed");
            return true; // Retorna true para não mudar o volume do sistema enquanto usa o app
        }
        return super.onKeyDown(keyCode, event);
    }
}
