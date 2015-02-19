package com.wikitude.mmi;


import android.app.Activity;
import android.app.ListActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import com.wikitude.samples.SampleCamActivity;
import com.wikitude.sdksamples.R;

import java.io.File;

public class MainGame extends ListActivity {

    public static final String titleString1 = "2.1 3d Model On Target";
    public static final String architectWorldURL1 = "2_3d$And$Image$Recognition_1_3d$Model$On$Target";

    public static final String EXTRAS_KEY_ACTIVITY_TITLE_STRING = "activityTitle";
    public static final String EXTRAS_KEY_ACTIVITY_ARCHITECT_WORLD_URL = "activityArchitectWorldUrl";

    public static final String EXTRAS_KEY_ACTIVITY_IR = "activityIr";
    public static final String EXTRAS_KEY_ACTIVITY_GEO = "activityGeo";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.setContentView(this.getContentViewId());

        this.setTitle(this.getActivityTitle());

        final String[] values = {"Play Game"};
        this.setListAdapter(new ArrayAdapter<String>(this,
                android.R.layout.simple_list_item_1, android.R.id.text1, values));

		/* extract names of samples from res/arrays */

		/* use default list-ArrayAdapter */

		/* get className of activity to call when clicking item at position x */
    }

    @Override
    protected void onListItemClick(ListView l, View v, int position, long id) {
        super.onListItemClick(l, v, position, id);

        // final String className = "SampleCamActivity";
        final String className = "MyCamActivity";

        try {

            final Intent intent = new Intent(this, MyCamActivity.class);

            intent.putExtra(EXTRAS_KEY_ACTIVITY_TITLE_STRING, titleString1);

            intent.putExtra(EXTRAS_KEY_ACTIVITY_ARCHITECT_WORLD_URL, "samples"
                    + File.separator + architectWorldURL1
                    + File.separator + "index.html");

            intent.putExtra(EXTRAS_KEY_ACTIVITY_IR, true);
            intent.putExtra(EXTRAS_KEY_ACTIVITY_GEO, false);

			/* launch activity */
            this.startActivity(intent);

        } catch (Exception e) {
			/*
			 * may never occur, as long as all SampleActivities exist and are
			 * listed in manifest
			 */
            Toast.makeText(this, className + "\nnot defined/accessible",
                    Toast.LENGTH_SHORT).show();
        }
    }


    protected int getContentViewId() {
        return R.layout.list_sample;
    }

    protected String getActivityTitle() {
        return titleString1;
    }

}
