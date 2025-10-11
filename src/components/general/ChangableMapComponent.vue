<template>
  <div class="map_wrapper">
    <div class="points-info">
      <h5>{{ $t('PLACEHOLDERS.click_to_add_points') }}</h5>
      <!-- <p class="instruction-text">{{ $t('PLACEHOLDERS.click_to_add_points') }}</p> -->
      <!-- <div v-for="(point, index) in points" :key="index" class="point-item">
        <span>{{ $t('PLACEHOLDERS.point') }} #{{ index + 1 }}: {{ point.placeName || 'Loading...' }}</span>
        <button @click="removePoint(index)" class="remove-btn">
          <i class="fas fa-times"></i>
        </button>
      </div> -->
    </div>
    
    <GmapMap
      :center="mapCenter"
      :zoom="12"
      map-type-id="terrain"
      style="width: 100%; height: 500px"
      @click="onMapClick"
    >
      <!-- Markers -->
      <GmapMarker
        v-for="(point, index) in points"
        :key="'marker-' + index"
        :position="{ lat: parseFloat(point.lat), lng: parseFloat(point.lng) }"
        :clickable="disabledMap ? false : true"
        :draggable="disabledMap ? false : true"
        :label="{
          text: (index + 1).toString(),
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        }"
        @click="removePoint(index)"
        @dragend="(event) => onMarkerDragEnd(event, index)"
      />
      
      <!-- Polygon to show area boundaries -->
      <GmapPolygon
        v-if="points.length >= 3"
        :paths="polygonPath"
        :options="{
          fillColor: '#814686',
          fillOpacity: 0.35,
          strokeColor: '#814686',
          strokeOpacity: 0.8,
          strokeWeight: 3
        }"
      />
      
      <!-- Polyline for less than 3 points -->
      <GmapPolyline
        v-if="points.length >= 2 && points.length < 3"
        :path="polygonPath"
        :options="{
          strokeColor: '#814686',
          strokeOpacity: 0.8,
          strokeWeight: 3
        }"
      />
    </GmapMap>
    
    <!-- <div class="map-legend" v-if="points.length > 0">
      <div class="legend-item">
        <div class="legend-color" style="background: #814686;"></div>
        <span>{{ points.length >= 3 ? $t('PLACEHOLDERS.place_boundary') : $t('PLACEHOLDERS.connecting_line') }}</span>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "MultiplePointsMapComponent",
  props: {
    initialPoints: {
      type: Array,
      default: () => []
    },
    disabledMap: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      points: [],
      defaultCenter: { lat: 24.7136, lng: 46.6753 } // Riyadh, Saudi Arabia
    };
  },

  computed: {
    mapCenter() {
      if (this.points.length > 0) {
        return {
          lat: parseFloat(this.points[0].lat),
          lng: parseFloat(this.points[0].lng)
        };
      }
      return this.defaultCenter;
    },
    
    polygonPath() {
      return this.points.map(p => ({
        lat: parseFloat(p.lat),
        lng: parseFloat(p.lng)
      }));
    }
  },

  mounted() {
    // Initialize points from props only if provided
    if (this.initialPoints && this.initialPoints.length > 0) {
      this.points = this.initialPoints.map(p => ({
        lat: p.lat,
        lng: p.lng,
        placeName: ''
      }));
      
      // Get place names for initial points
      this.points.forEach((point, index) => {
        this.getPlaceName(point.lat, point.lng, index);
      });
    }
  },

  methods: {
    onMarkerDragEnd(event, index) {
      if (this.disabledMap) return;
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();

      this.points[index].lat = newLat;
      this.points[index].lng = newLng;
      
      this.getPlaceName(newLat, newLng, index);
      this.emitPoints();
    },

    onMapClick(event) {
      if (this.disabledMap) return;
      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();

      // Add new point
      this.points.push({
        lat: clickedLat,
        lng: clickedLng,
        // placeName: 'Loading...'
      });

      const newIndex = this.points.length - 1;
      this.getPlaceName(clickedLat, clickedLng, newIndex);
      this.emitPoints();
    },

    removePoint(index) {
      if (this.disabledMap) return;
      this.points.splice(index, 1);
      this.emitPoints();
    },

    async getPlaceName(lat, lng, index) {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
          this.points[index].placeName = results[0].formatted_address;
        } else {
          this.points[index].placeName = "Unknown Location";
        }
        this.emitPoints();
      });
    },

    emitPoints() {
      // Emit array of points with lat, lng (without placeName for API)
      const pointsData = this.points.map(p => ({
        lat: p.lat,
        lng: p.lng
      }));
      this.$emit('update:points', pointsData);
    }
  },
};
</script>

<style scoped>
.map_wrapper {
  width: 100%;
  margin: 20px 0;
}

.points-info {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 2px solid #814686;
}

.points-info h5 {
  color: #814686;
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
}

.instruction-text {
  color: #666;
  font-size: 13px;
  margin-bottom: 10px;
  font-style: italic;
}

.point-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 14px;
  border-left: 3px solid #814686;
  transition: all 0.2s;
}

.point-item:hover {
  transform: translateX(-3px);
  box-shadow: 0 2px 8px rgba(129, 70, 134, 0.2);
}

.remove-btn {
  background: #e63757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #d32f4a;
  transform: scale(1.1);
}

.map-legend {
  margin-top: 10px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #555;
}

.legend-color {
  width: 30px;
  height: 15px;
  border-radius: 3px;
  border: 1px solid #666;
}
</style>