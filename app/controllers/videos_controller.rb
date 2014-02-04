class VideosController < ApplicationController

  def show
    @video = Video.find(params[:id])
    @countries = @video.countries
    @term = @video.term
    @shared = @video.share_info
  end
end