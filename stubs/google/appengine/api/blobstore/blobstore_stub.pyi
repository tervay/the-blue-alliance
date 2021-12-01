from google.appengine.api import apiproxy_stub
from typing import Any

class Error(Exception): ...
class ConfigurationError(Error): ...

def CreateUploadSession(creation, success_path, user, max_bytes_per_blob, max_bytes_total, bucket_name: Any | None = ...): ...

class BlobstoreServiceStub(apiproxy_stub.APIProxyStub):
    GS_BLOBKEY_PREFIX: str
    THREADSAFE: bool
    def __init__(self, blob_storage, time_function=..., service_name: str = ..., uploader_path: str = ..., request_data: Any | None = ..., storage_dir: Any | None = ..., app_id: str = ...) -> None: ...
    @classmethod
    def ToDatastoreBlobKey(cls, blobkey): ...
    @property
    def storage(self): ...
    @classmethod
    def DeleteBlob(cls, blobkey, storage) -> None: ...
    @classmethod
    def CreateEncodedGoogleStorageKey(cls, filename): ...
    def CreateBlob(self, blob_key, content): ...