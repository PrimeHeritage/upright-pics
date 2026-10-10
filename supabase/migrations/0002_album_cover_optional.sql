-- New albums start empty, so the cover is set once photos are added.
-- A published album must always have a cover.
alter table public.albums alter column cover drop not null;
alter table public.albums
  add constraint albums_published_requires_cover check (not published or cover is not null);
