from rest_framework import serializers

class MovieSerializer(serializers.Serializer):
   title = serializers.CharField()