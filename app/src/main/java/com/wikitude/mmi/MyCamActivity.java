package com.wikitude.mmi;

import android.hardware.SensorManager;
import android.location.LocationListener;
import android.widget.Toast;

import com.wikitude.architect.ArchitectView.ArchitectUrlListener;
import com.wikitude.architect.ArchitectView.SensorAccuracyChangeListener;
import com.wikitude.samples.AbstractArchitectCamActivity;
import com.wikitude.samples.ArchitectViewHolderInterface;
import com.wikitude.samples.LocationProvider;
import com.wikitude.samples.MainSamplesListActivity;
import com.wikitude.samples.WikitudeSDKConstants;
import com.wikitude.sdksamples.R;

public class MyCamActivity extends AbstractArchitectCamActivity {

	/**
	 * last time the calibration toast was shown, this avoids too many toast shown when compass needs calibration
	 */
	private long lastCalibrationToastShownTimeMillis = System.currentTimeMillis();

    public static final String titleString1 = "2.1 3d Model On Target";
    public static final String architectWorldURL1 = "2_3d$And$Image$Recognition_1_3d$Model$On$Target";

    @Override
	public String getARchitectWorldPath() {
		return architectWorldURL1;
	}

	@Override
	public String getActivityTitle() {
        return titleString1;
	}

	@Override
	public int getContentViewId() {
		return R.layout.sample_cam;
	}

	@Override
	public int getArchitectViewId() {
		return R.id.architectView;
	}
	
	@Override
	public String getWikitudeSDKLicenseKey() {
		return "kDjGp5ws1DkyPxkFk5Kuuif6pnvJMj+dnlFBQ45o4n+ierZ4AcyhVTzW3pNwVmNix91y6wRDGXjt+1GZeibxQyNXlWOKrZEjFc/yrqiO5PObHTsMWF+nAgO/9Uez1HihTuIdLze5m4U29mgEOW7X8e4j/mu4TMHGUt8q+Cr7O+5TYWx0ZWRfX0QOJB749b1G5FhzXp0zGNm47/xLEep/tUp+dI/CPK+RQOwJTBcqGLDJ8HbXekwpeMBNNMJW9ymVJaD2Fh9+QbdcNuIqsEF25TndIby0gwXPg9bm3U4EEczNDBSXoQ1ROlTV6MoNa82Q+Cyfp59JP/ofZjGJZvutF2s9bJN4yIy4T99sciOWATGR/iBNPkplrN5nOLFF2ttcNLGCAR6YpArp04Uzm4HzlH3Fr/+wTM3VuPOP7MUAESxF+hSYdVBSJEhDLJy0JoFKdQCY3qzWLyroXYeMioenp0+y80R1c5Rb3BtF3Okp3NL2pvrlrAM0F7dDhiG4zlOoU1paDaSm39G+bk/ii6gmuV8jj5seKObsSsHGitySlO5M4mmgXmJlhgWQUYKJX1qk4oveN0oShK16Ut1jhKFgcLDngDr+vVgtm0HcBlDb025gx2D7fH4opZkHSP4f0Yo7jzgriJnwAamwMxgXfm1Kx+lVI9ah/HDo9XkWUPLfd/4=";
	}
	
	@Override
	public SensorAccuracyChangeListener getSensorAccuracyListener() {
		return new SensorAccuracyChangeListener() {
			@Override
			public void onCompassAccuracyChanged( int accuracy ) {
				/* UNRELIABLE = 0, LOW = 1, MEDIUM = 2, HIGH = 3 */
				if ( accuracy < SensorManager.SENSOR_STATUS_ACCURACY_MEDIUM && MyCamActivity.this != null && !MyCamActivity.this.isFinishing() && System.currentTimeMillis() - MyCamActivity.this.lastCalibrationToastShownTimeMillis > 5 * 1000) {
					Toast.makeText( MyCamActivity.this, R.string.compass_accuracy_low, Toast.LENGTH_LONG ).show();
					MyCamActivity.this.lastCalibrationToastShownTimeMillis = System.currentTimeMillis();
				}
			}
		};
	}

	@Override
	public ArchitectUrlListener getUrlListener() {
		return new ArchitectUrlListener() {

			@Override
			public boolean urlWasInvoked(String uriString) {
				// by default: no action applied when url was invoked
				return false;
			}
		};
	}

	@Override
	public ILocationProvider getLocationProvider(final LocationListener locationListener) {
		return new LocationProvider(this, locationListener);
	}
	
	@Override
	public float getInitialCullingDistanceMeters() {
		// you need to adjust this in case your POIs are more than 50km away from user here while loading or in JS code (compare 'AR.context.scene.cullingDistance')
		return ArchitectViewHolderInterface.CULLING_DISTANCE_DEFAULT_METERS;
	}

	@Override
	protected boolean hasGeo() {
		return false;
	}

	@Override
	protected boolean hasIR() {
		return true;
	}
}
