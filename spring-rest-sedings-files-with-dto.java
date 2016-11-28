final LinkedMultiValueMap<String, Object> parametres = new LinkedMultiValueMap<>();
parametres.add("myDto", myDto);

for (final MultipartFile file : files)
{
	parametres.add("files", new ByteArrayResource(file.getBytes()) {
    @Override
    public String getFilename()
    {
      return file.getOriginalFilename();
    }
	});
}

final HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.MULTIPART_FORM_DATA);
final HttpEntity<LinkedMultiValueMap<String, Object>> request = new HttpEntity<LinkedMultiValueMap<String, Object>>(parametres, headers);

this.restClientHelper.getRestTemplate().postForObject("file/save", request, Object.class);
