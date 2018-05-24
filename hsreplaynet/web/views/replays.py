from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic import View

from hsreplaynet.games.models import GameReplay
from hsreplaynet.uploads.models import UploadEvent


class MyReplaysView(LoginRequiredMixin, View):
	template_name = "games/my_replays.html"

	def get(self, request):
		replays = GameReplay.objects.live().filter(user=request.user).count()
		context = {"replays": replays}
		request.head.title = "My Replays"
		return render(request, self.template_name, context)


class ReplayDetailView(View):
	template_name = "games/replay_detail.html"

	def get(self, request, id):
		replay = GameReplay.objects.find_by_short_id(id)
		if not replay or replay.is_deleted:
			raise Http404("Replay not found.")

		replay.views += 1
		replay.save()

		request.head.set_canonical_url(replay.get_absolute_url())
		description = replay.generate_description()

		twitter_card = request.GET.get("twitter_card", "summary")
		if twitter_card not in ("summary", "player"):
			twitter_card = "summary"

		request.head.title = replay.pretty_name_spoilerfree
		request.head.add_meta(
			{"name": "description", "content": description},
			{"name": "date", "content": replay.global_game.match_start.isoformat()},
			{"property": "og:description", "content": description},
			{"name": "twitter:card", "content": twitter_card},
		)

		request.head.add_stylesheets(
			settings.JOUST_STATIC_URL + "joust.css",
			"fonts/belwefs_extrabold_macroman/stylesheet.css",
			"fonts/franklingothicfs_mediumcondensed_macroman/stylesheet.css",
		)

		if twitter_card == "player":
			thumbnail = request.build_absolute_uri(static("images/joust-thumbnail.png"))
			embed_url = reverse("games_replay_embed", kwargs={"id": replay.shortid})
			request.head.add_meta(
				{"name": "twitter:player", "content": request.build_absolute_uri(embed_url)},
				{"name": "twitter:player:width", "content": 640},
				{"name": "twitter:player:height", "content": 360},
				{"name": "twitter:image", "content": thumbnail},
			)

		context = {
			"replay": replay,
			"players": replay.global_game.players.all(),
		}
		return render(request, self.template_name, context)


class ReplayEmbedView(View):
	template_name = "games/replay_embed.html"

	@xframe_options_exempt
	def get(self, request, id):
		replay = GameReplay.objects.find_by_short_id(id)
		if not replay or replay.is_deleted:
			raise Http404("Replay not found.")
		return render(request, self.template_name, {"replay": replay})


class AnnotatedReplayView(View):
	def get(self, request, shortid):
		from hsreplay.utils import annotate_replay
		from io import BytesIO

		replay = GameReplay.objects.find_by_short_id(shortid)
		if not replay or replay.is_deleted:
			raise Http404("Replay not found.")

		replay_xml = replay.replay_xml.open()
		annotated_replay = BytesIO()
		annotate_replay(replay_xml, annotated_replay)

		response = HttpResponse(annotated_replay.getvalue())
		response["Content-Type"] = "application/xml"
		return response


class UploadDetailView(View):
	def get(self, request, shortid):
		replay = GameReplay.objects.find_by_short_id(shortid)
		if replay:
			return HttpResponseRedirect(replay.get_absolute_url())

		# This setting lets us prevent the only site-wide queyr on UploadEvent.
		# Bit of a hack but it does the job for now.
		if getattr(settings, "UPLOADS_DB_DISABLED", False):
			upload = None
		else:
			try:
				upload = UploadEvent.objects.get(shortid=shortid)
				if upload.game:
					return HttpResponseRedirect(upload.game.get_absolute_url())
			except UploadEvent.DoesNotExist:
				# It is possible the UploadEvent hasn't been created yet.
				upload = None

		request.head.title = "Uploading replay..."

		context = {}
		context["upload"] = upload
		context["redirect_url"] = request.build_absolute_uri(request.path)

		return render(request, "uploads/processing.html", context)